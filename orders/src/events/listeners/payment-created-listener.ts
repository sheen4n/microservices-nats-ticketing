import { QUEUE_GROUP_NAME } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@sheen4ntix/common';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { id, orderId } = data;

    const order = await Order.findById(orderId);

    if (!order) throw new Error('Order not found');

    order.set({ status: OrderStatus.Complete, paymentDate: new Date() });

    await order.save();

    msg.ack();
  }
}
