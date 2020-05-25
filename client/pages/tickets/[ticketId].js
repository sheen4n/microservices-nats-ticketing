import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price.toFixed(2)}</h4>
      {errors}
      {currentUser && (
        <button onClick={() => doRequest()} className='btn btn-primary mt-5'>
          Purchase
        </button>
      )}
      {!currentUser && (
        <button className='btn btn-dark mt-5' disabled>
          Login to Purchase
        </button>
      )}
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data: ticket } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket };
};

export default TicketShow;
