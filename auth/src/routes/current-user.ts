// This route is for frontend app to verify if the user is logged in
// Cause we made sure javascript on the browser aren't able to decide whether user is logged in or not
// e.g.
//   Let's say a malicious user get an email and the password,
//   they aren't able to generate a legal JWT ,
//   without the JWT secret key on the server side.

// What they can do is send a request with a JWT to the serverside,
// and the auth service can gernerate the JWT with the payload,
// and then compare the 2 JWT to check if it is the correct JWT.

import { Router } from "express";

import { currentUser } from "@estest/common";

const router = Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
