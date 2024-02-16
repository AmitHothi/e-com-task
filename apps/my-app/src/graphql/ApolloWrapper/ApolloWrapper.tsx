'use client';

import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr';
import { setVerbosity } from 'ts-invariant';
import { makeClient } from '../client/makeClient';

export const ApolloWrapper = ({ children }: React.PropsWithChildren) => {
  if (process.env.NODE_ENV === 'development') {
    setVerbosity('debug');
    loadDevMessages();
    loadErrorMessages();
  }

  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
};
