import { Publisher, OrderCreatedEvent, Subjects } from "@estest/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
