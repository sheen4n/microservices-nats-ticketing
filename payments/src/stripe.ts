import Stripe from 'stripe';
import config from 'config';

export const stripe = new Stripe(config.get('stripeKey'), {
  apiVersion: '2020-03-02',
});
