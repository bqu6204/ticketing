import request from "supertest";
import { app } from "../app";

export class TestHelper {
  static app = app;
  static email = "test@test.com";
  static password = "password";

  static signin = async () => {
    const response = await request(this.app)
      .post("/api/users/signup")
      .send({ email: this.email, password: this.password })
      .expect(201);

    const cookie = response.get("Set-Cookie");
    return cookie;
  };
}
