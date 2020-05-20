import { QUEUE_GROUP_NAME } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  OrderCancelledEvent,
  OrderStatus,
} from '@sheen4ntix/common';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { id: orderId } = data;

    const orderInDb = await Order.findOne({
      _id: orderId,
      version: data.version - 1,
    });

    if (!orderInDb) throw new Error('Order Not Found');

    orderInDb.set({ status: OrderStatus.Cancelled });

    await orderInDb.save();

    msg.ack();
  }
}
