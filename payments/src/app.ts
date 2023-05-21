import express from "express";
import "express-async-errors"; // an npm package to make throw error in an async function behave as in a sync function
import cookieSession from "cookie-session";
import { createChargeRouter } from "./routes/new";

import { errorHandler, NotFoundError, currentUser } from "@estest/common";
console.log("apple");

const app = express();
app.set("trust proxy", true); // make express aware requests is behind a proxy of Ingress Nginx, and can trust traffic comming from proxies
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // if true, make sure user sending request through HTTPS
  })
);

// Run app.use(currentUser) after app.use(cookieSession({...})),
// so that the app can set the req.session property.
app.use(currentUser);

app.use(createChargeRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
