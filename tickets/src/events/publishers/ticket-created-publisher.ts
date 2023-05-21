import { Publisher, Subjects, TicketCreatedEvent } from "@estest/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
