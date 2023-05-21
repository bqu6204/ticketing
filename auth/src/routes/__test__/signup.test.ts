import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test-should-fail",
      password: "password",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "password",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "password",
    })
    .expect(400);
  return;
});

it("returns a 400 with an invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "pas",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "passwordpasswordpassword",
    })
    .expect(400);
  return;
});

it("returns a 400 with missing email and password", async () => {
  await request(app).post("/api/users/signup").send({}).expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({ email: "", password: "" })
    .expect(400);
  return;
});

it("disallows dupicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);

  return;
});

it("sets a cookie after successful setup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
