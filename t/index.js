process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');

const cookie =
  'express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalZsWW1VelpXTXdOVE5rTURnNE1EQXlNMkk0T1dKa01TSXNJbVZ0WVdsc0lqb2ljMnhoWVdGelUwRkVRVk5FUVZOa1pFQnpZV1J6TG1OdmJTSXNJbWxoZENJNk1UVTRPVFV5TmpJd09IMC5sX2NzVmdZT29mSXdHN3I0dTJhUmJCdjN3ejU2MnZiOEJoZ3dtVjctUExZIn0=';

const doRequest = async () => {
  const { data } = await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: 'ticket', price: 5 },
    {
      headers: { cookie },
    }
  );

  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 10 },
    {
      headers: { cookie },
    }
  );

  axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 15 },
    {
      headers: { cookie },
    }
  );

  console.log('Request complete');
};

(async () => {
  for (let i = 0; i < 400; i++) {
    doRequest();
  }
})();

// Get the cookie first

// Sequence of steps to test
// Run all the containers together
// Fire the orders using this file "node index.js"
// Use docker ps to get running container of mongo for orders and tickets

// for each container run
// mongo
// show dbs
// use orders OR use tickets (depending on which)
// show collections
// db.tickets.find({"price":15}).length()
// both should equal 400
