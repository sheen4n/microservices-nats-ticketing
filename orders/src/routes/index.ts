import express, { Request, Response } from 'express';
import { requireAuth } from '@sheen4ntix/common';
import { Order } from '../models/order';
// import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  // const tickets = await Ticket.find({});

  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');

  res.send(orders);
});

export { router as indexOrderRouter };
