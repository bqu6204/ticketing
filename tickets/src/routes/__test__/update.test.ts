import request from "supertest";
import { app } from "../../app";
import { TestHelper } from "../../test/helpers";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided ticket id does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", TestHelper.signinWithRandomUser())
    .send({
      title: "consert",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .send({
      title: "consert",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket ", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", TestHelper.signinWithRandomUser())
    .send({
      title: "asdf",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", TestHelper.signinWithRandomUser())
    .send({
      title: "zxvc",
      price: 30,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = TestHelper.signinWithRandomUser();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdf",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -10,
    })
    .expect(400);
});
it("updates the ticket provided valid inputs", async () => {
  const cookie = TestHelper.signinWithRandomUser();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdf",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});

it("publishes an event", async () => {
  const cookie = TestHelper.signinWithRandomUser();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdf",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const cookie = TestHelper.signinWithRandomUser();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdf",
      price: 20,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(400);
});
