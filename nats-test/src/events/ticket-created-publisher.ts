import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent, Publisher, Subjects } from '@sheen4ntix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
