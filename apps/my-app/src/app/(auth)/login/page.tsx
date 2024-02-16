'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { setCookie } from 'cookies-next';
import LOGIN_USER from '@/graphql/schema/mutations/login.graphql';

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [LoginUser, { data, loading, error }] = useMutation(LOGIN_USER, {
    fetchPolicy: 'network-only',
  });

  if (loading) return <h1>Loading</h1>;
  console.log('login', data);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password);
    LoginUser({
      variables: {
        userLoginInput: { email, password },
      },
    })
      .then((res) => {
        console.log('res', res);
        setCookie('token', res?.data?.login?.access_token);
        setCookie('refreshToken', res?.data?.login?.refresh_token);
        console.log(res?.data?.login?.access_token);
        router.push('/');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex h-full flex-1">
      {error && <div className="red card-panel">{error.message}</div>}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="py-2 h-10 w-6/12 bg-blue-600 text-white border-2 border-blue-600 rounded-md font-bold text-center">
              ASSIGN TASK
            </h2>
          </div>

          <div className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            <h3>Sign in your Account</h3>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <label htmlFor="phone" className="block text-sm font-bold leading-6 text-gray-900">
                  E-mail
                  <div className="mt-1 font-medium">
                    <input
                      required
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      placeholder="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 p-3 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </label>
              </div>

              <div className="space-y-6 mt-2">
                <label htmlFor="otp" className="block text-sm font-bold leading-6 text-gray-900">
                  Password
                  <div className="mt-1">
                    <input
                      required
                      id="password"
                      name="password"
                      value={password}
                      type="password"
                      placeholder="password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 p-3 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </label>
              </div>

              <div className="mt-4 text-blue-600">
                <Link href="/register">
                  <p>
                    You have not an Account ? <b>Click here</b>
                  </p>
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  className="mt-5 flex w-full bg-blue-500 rounded-lg  font-bold justify-center px-3 py-2.5 text-sm text-white leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className=" w-0 flex-1 lg:block">
        <img
          className="inset-0 pb-0 h-screen w-full object-cover"
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt=""
        />
      </div>
    </div>
  );
};

export default Login;
