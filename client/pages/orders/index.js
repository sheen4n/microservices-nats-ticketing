import moment from 'moment';

const OrderIndex = ({ orders }) => {
  console.log(orders);
  const orderList = orders.map((order) => (
    <tr key={order.id}>
      <td>{order.ticket.title}</td>
      <td>${order.ticket.price.toFixed(2)}</td>
      <td>{order.status.toUpperCase()}</td>
      <td>
        {order.paymentDate &&
          moment(order.paymentDate)
            .utcOffset(8)
            .format('DD-MMM-YYYY, HH:mm:ss')}
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>My Orders</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Ticket Title</th>
            <th>Ticket Price</th>
            <th>Order Status</th>
            <th>Payment Date</th>
          </tr>
        </thead>
        <tbody>{orderList}</tbody>
      </table>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data: orders } = await client.get('/api/orders');

  return { orders };
};

export default OrderIndex;
