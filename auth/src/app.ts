import express from "express";
import "express-async-errors"; // an npm package to make throw error in an async function behave as in a sync function
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler, NotFoundError } from "@estest/common";

const app = express();
app.set("trust proxy", true); // make express aware requests is behind a proxy of Ingress Nginx, and can trust traffic comming from proxies
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // if true, make sure user sending request through HTTPS
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
