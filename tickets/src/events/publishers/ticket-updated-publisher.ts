import { Publisher, Subjects, TicketUpdatedEvent } from "@estest/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
