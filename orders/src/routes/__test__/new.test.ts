import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { TestHelper } from "../../test/helpers";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@estest/common";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exist ", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", TestHelper.signinWithRandomUser())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved ", async () => {
  // create a fake ticket and a fake order
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  const order = Order.build({
    ticket,
    userId: "asdfasdf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  // the actual request being test
  await request(app)
    .post("/api/orders")
    .set("Cookie", TestHelper.signinWithRandomUser())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", TestHelper.signinWithRandomUser())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an order created event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", TestHelper.signinWithRandomUser())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
