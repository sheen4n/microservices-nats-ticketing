import { QUEUE_GROUP_NAME } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@sheen4ntix/common';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id: orderId } = data;

    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add(
      {
        orderId,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
