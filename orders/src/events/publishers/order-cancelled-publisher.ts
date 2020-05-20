import { Publisher, Subjects, OrderCancelledEvent } from '@sheen4ntix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
