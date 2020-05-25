import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  if (tickets.length === 0)
    return (
      <div>
        <h1>List of Tickets</h1>
        <p>
          Come Back Later! There are right now no tickets available for
          purchase.
        </p>
      </div>
    );

  const ticketList = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>${ticket.price.toFixed(2)}</td>
      <td>
        <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
          <a>View</a>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Tickets Available For Sale</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data: tickets } = await client.get('/api/tickets');
  return { tickets };
};

export default LandingPage;
