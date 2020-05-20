import { QUEUE_GROUP_NAME } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent } from '@sheen4ntix/common';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { ticket } = data;
    const ticketInDb = await Ticket.findById(ticket.id);

    if (!ticketInDb) throw new Error('Ticket not found');

    ticketInDb.set({ orderId: undefined });

    await ticketInDb.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticketInDb.id,
      price: ticketInDb.price,
      title: ticketInDb.title,
      userId: ticketInDb.userId,
      version: ticketInDb.version,
      orderId: ticketInDb.orderId,
    });

    msg.ack();
  }
}
