import request from "supertest";
import { app } from "../../app";
import { TestHelper } from "../../test/helpers";

it("can fetch a list of tickets", async () => {
  await TestHelper.createTicket();
  await TestHelper.createTicket();
  await TestHelper.createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
