import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@sheen4ntix/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
