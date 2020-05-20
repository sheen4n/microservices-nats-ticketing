import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@sheen4ntix/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';
import { natsWrapper } from '../../nats-wrapper';

it('another user tries to pay for the order', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    version: 0,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ orderId: order.id, token: 'Random Token' })
    .expect(401);
});

it('returns an error if the order does not exist', async () => {
  const orderId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ orderId, token: 'Random Token' })
    .expect(404);
});

it('user tries to make payment for cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 20,
    version: 0,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ orderId: order.id, token: 'Random Token' })
    .expect(400);
});

// it('successfully makes payment for order charges to stripe with 204 with valid user and input - mock', async () => {
//   const userId = new mongoose.Types.ObjectId().toHexString();
//   const price = 20;
//   const order = Order.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     userId,
//     price,
//     version: 0,
//     status: OrderStatus.Created,
//   });

//   await order.save();

//   await request(app)
//     .post('/api/payments')
//     .set('Cookie', global.signin(userId))
//     .send({ orderId: order.id, token: 'tok_visa' })
//     .expect(201);

//   expect(stripe.charges.create).toHaveBeenCalledTimes(1);

//   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//   expect(chargeOptions.source).toEqual('tok_visa');
//   expect(chargeOptions.amount).toEqual(price * 100);
//   expect(chargeOptions.currency).toEqual('usd');
// });

it('successfully makes payment for order charges to stripe with 204 with valid user and input - actual request', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    price,
    version: 0,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ orderId: order.id, token: 'tok_visa' })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  );

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');
});

it('successfully creates payment in database with valid user and input - actual request', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    price,
    version: 0,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ orderId: order.id, token: 'tok_visa' })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  );

  const paymentInDb = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(paymentInDb).not.toBe(null);
});

it('publishes an event upon successful creation', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    price,
    version: 0,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ orderId: order.id, token: 'tok_visa' })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
});
