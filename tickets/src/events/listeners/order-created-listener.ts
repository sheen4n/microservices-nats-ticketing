import { QUEUE_GROUP_NAME } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@sheen4ntix/common';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { ticket, id: orderId } = data;
    const ticketInDb = await Ticket.findById(ticket.id);

    if (!ticketInDb) throw new Error('Ticket not found');

    ticketInDb.set({ orderId });

    await ticketInDb.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticketInDb.id,
      price: ticketInDb.price,
      title: ticketInDb.title,
      userId: ticketInDb.userId,
      orderId,
      version: ticketInDb.version,
    });

    msg.ack();
  }
}
