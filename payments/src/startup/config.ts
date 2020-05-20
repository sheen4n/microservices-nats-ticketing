import config from 'config';

export default () => {
  if (!config.get('stripeKey')) {
    console.error('Fatal Error: Stripe Key is not defined.');
    throw new Error('Fatal Error: Stripe Key is not defined.');
  }
};
