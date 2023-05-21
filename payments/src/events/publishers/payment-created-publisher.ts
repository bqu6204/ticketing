import { Subjects, Publisher, PaymentCreatedEvent } from "@estest/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
