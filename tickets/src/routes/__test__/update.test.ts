import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from './../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Updated Title',
      price: 200,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).put(`/api/tickets/${id}`).send().expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'First Title',
      price: 200,
    });

  const ticketId = response.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Updated Title',
      price: 1,
    })
    .expect(401);
});

it('returns a 400 if the user tries to edit a reserved ticket', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'First Title',
      price: 200,
    });

  const ticketId = response.body.id;

  const ticketInDb = await Ticket.findById(ticketId);
  ticketInDb?.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticketInDb?.save();

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title: 'Updated Title',
      price: 1,
    })
    .expect(400);
});

it('returns a 400 if the user provides an invalid or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'First Title',
      price: 200,
    });

  const ticketId = response.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 1,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title: 'Updated',
      price: -100,
    })
    .expect(400);
});

it('updates the ticket if provided valid input', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'First Title',
      price: 200,
    });

  const ticketId = response.body.id;
  const updatedTitle = 'Updated Title';
  const updatedPrice = 200;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  const getUpdatedTicketResponse = await request(app)
    .get(`/api/tickets/${ticketId}`)
    .expect(200);

  expect(getUpdatedTicketResponse.body.title).toEqual(updatedTitle);
  expect(getUpdatedTicketResponse.body.price).toEqual(updatedPrice);
});

it('publishes an event upon successful update', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'First Title',
      price: 200,
    });

  const ticketId = response.body.id;
  const updatedTitle = 'Updated Title';
  const updatedPrice = 200;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  await request(app).get(`/api/tickets/${ticketId}`).expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
