import { Publisher, Subjects, PaymentCreatedEvent } from '@sheen4ntix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
