import { Publisher, Subjects, TicketCreatedEvent } from '@sheen4ntix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
