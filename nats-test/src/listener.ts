import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  // whenever stan (NATS client) is closed, exit process;
  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// Process watching for signal interrupt (eg. restart server )
// whenever an interrupt signal occurs, gracefully close down the process
process.on("SIGINT", () => stan.close());

// Process watching for terminal signal, (eg. command + c )
// whenever an interrupt signal occurs, gracefully close down the process
process.on("SIGTERM", () => stan.close());
