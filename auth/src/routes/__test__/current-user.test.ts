import request from "supertest";
import { app } from "../../app";
import { TestHelper } from "../../test/helpers";

it("responds with details about the current user", async () => {
  const cookie = await TestHelper.signin();

  // although we do get cookie in the first request ,
  // we don't get in the second one,
  // so current-user will be null.
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
