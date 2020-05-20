import { Publisher, Subjects, OrderCreatedEvent } from '@sheen4ntix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
