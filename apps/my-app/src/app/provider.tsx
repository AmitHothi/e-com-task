'use client';

import { ApolloWrapper } from '@/graphql/ApolloWrapper';

const Provider = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) => (
  <div>
    <ApolloWrapper>{children}</ApolloWrapper>
  </div>
);
export default Provider;
