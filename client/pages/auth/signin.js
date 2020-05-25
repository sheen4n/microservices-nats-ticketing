import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <div className='form-group'>
        <label htmlFor='email'>Email Address</label>
        <input
          id='email'
          type='text'
          value={email}
          className='form-control'
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='form-group'>
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          type='password'
          value={password}
          className='form-control'
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <button className='btn btn-primary'>Sign In</button>
    </form>
  );
};

export default SignIn;
