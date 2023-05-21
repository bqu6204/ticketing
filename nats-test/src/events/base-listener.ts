import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    // Options setting functions needs to be chained after subscriptionOptions().
    // Such as subscriptionOptions().setDeliverAllAvailable().setDurableName()....
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true) // Ack short for acknowledge, acknowledge we received the event
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName); // As the system running for a period of time, there might be thousand of events, so we usually don't use this function
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string" // string or buffer
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}

export { Listener };
