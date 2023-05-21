import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export class TestHelper {
  static app = app;
  static email = "test@test.com";
  static password = "password";
  static ticket = "consert";
  static price = 20;

  static signinWithRandomUser = () => {
    // In every microservice, we hope that every service can be self maintained.

    // So we need to create the JWT token for testing purpose,
    // without reaching out to the auth service and actually signin.

    // We can simulate a signed-in user by creating our own JWT with the following steps.

    // STEP 1: Build a JWT payload. { id, email }
    const payload = {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: this.email,
    };

    // STEP 2: Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // STEP 3: Build the session object. {jwt: MY_JWT}
    const session = { jwt: token };

    // STEP 4: Turn that session into JSON.
    const sessionJSON = JSON.stringify(session);

    // STEP 5: Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    // STEP 6: Return a string thats the cookie with the encoded data.
    const cookie = [`session=${base64}`];

    return cookie;
  };

  static signinWithSpecificUser = (id: string) => {
    // In every microservice, we hope that every service can be self maintained.

    // So we need to create the JWT token for testing purpose,
    // without reaching out to the auth service and actually signin.

    // We can simulate a signed-in user by creating our own JWT with the following steps.

    // STEP 1: Build a JWT payload. { id, email }
    const payload = {
      id: id,
      email: this.email,
    };

    // STEP 2: Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // STEP 3: Build the session object. {jwt: MY_JWT}
    const session = { jwt: token };

    // STEP 4: Turn that session into JSON.
    const sessionJSON = JSON.stringify(session);

    // STEP 5: Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    // STEP 6: Return a string thats the cookie with the encoded data.
    const cookie = [`session=${base64}`];

    return cookie;
  };

  static createTicket = () => {
    return request(app)
      .post("/api/tickets")
      .set("Cookie", this.signinWithRandomUser())
      .send({
        title: this.email,
        price: this.price,
      });
  };
}
