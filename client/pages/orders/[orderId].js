import { useEffect, useState } from 'react';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    // Call Once
    findTimeLeft();
    // Set Interval Subsequently
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0)
    return (
      <div>
        <h1>Ticket Title: {order.ticket.title}</h1>
        <h2>Price: ${order.ticket.price.toFixed(2)}</h2>
        <p>Order Has Expired... Please try again.</p>
      </div>
    );

  return (
    <div>
      <h1>Ticket Title: {order.ticket.title}</h1>
      <h2>Price: ${order.ticket.price.toFixed(2)}</h2>

      <p>Time left to pay: {timeLeft} seconds</p>
      <div className='mt-5'>
        <StripeCheckout
          token={(token) => doRequest({ token: token.id })}
          stripeKey='pk_test_rI0vVLFmlZ1Fk5hlBxKlciWb00BB8BOmrr'
          amount={order.ticket.price * 100}
          email={currentUser.email}
        />
        {errors}
      </div>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data: order } = await client.get(`/api/orders/${orderId}`);
  return { order };
};

export default OrderShow;
