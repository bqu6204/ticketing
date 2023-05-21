import { Publisher, OrderCancelledEvent, Subjects } from "@estest/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
