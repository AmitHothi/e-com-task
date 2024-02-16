'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import SIGNUP_USER from '@/graphql/schema/mutations/signUp.graphql';

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<IFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const router = useRouter();
  const [signUpUser, { data, loading, error }] = useMutation(SIGNUP_USER);
  if (loading) return <h1>Loading</h1>;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    signUpUser({
      variables: {
        createUserInput: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
      },
    })
      .then((res) => {
        console.log('register', res.data);
        router.push('/login', { scroll: false });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        {error && <div className="red cardpanel">{error.message}</div>}

        {data && data.signupUserDummy && (
          <div className="green cardpanel">
            {data.signupUserDummy.firstName} is signUp. You can login now
          </div>
        )}
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="py-2 h-10 w-6/12 bg-blue-600 text-white border-2 border-blue-600 rounded-md font-bold text-center">
              ASSIGN TASK
            </h2>
          </div>

          <div className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            <h3>Register your Account</h3>
          </div>

          <div className="mt-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-row gap-2">
                <div className="space-y-6">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    First Name
                    <div className="mt-px">
                      <input
                        required
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Enter your firstName"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 p-3 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </label>
                </div>
                <div className="space-y-6">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Last Name
                    <div className="mt-px">
                      <input
                        required
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Enter your lastName"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 p-3 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-6 mt-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  E-mail
                  <div className="mt-px">
                    <input
                      required
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email"
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 p-3 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </label>
              </div>

              <div className="space-y-6 mt-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                  <div className="mt-px">
                    <input
                      required
                      id="password"
                      name="password"
                      type="password"
                      placeholder="password"
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 p-3 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </label>
              </div>
              <div className="mt-4 text-blue-600">
                <Link href="/login">
                  <p>
                    Already have an account? <b>Click here!</b>
                  </p>
                </Link>
              </div>
              <div>
                <button
                  type="submit"
                  className="mt-5 flex w-full bg-blue-500 rounded-lg  font-bold justify-center px-3 py-2.5 text-sm text-white leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className=" hidden w-0 flex-1 lg:block">
        <img
          className=" inset-0 h-screen w-full object-cover"
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt=""
        />
      </div>
    </div>
  );
};

export default Signup;
