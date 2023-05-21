import { Publisher, ExpirationCompleteEvent, Subjects } from "@estest/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
