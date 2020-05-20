import { QUEUE_GROUP_NAME } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@sheen4ntix/common';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id: orderId, ticket, version, userId, status } = data;

    const order = Order.build({
      id: orderId,
      status: status,
      price: ticket.price,
      version,
      userId,
    });

    await order.save();

    msg.ack();
  }
}
