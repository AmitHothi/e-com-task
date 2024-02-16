import { useRouter } from 'next/navigation';
import { ApolloLink, FetchResult, GraphQLRequest, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { Observable, getMainDefinition } from '@apollo/client/utilities';
import {
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { GraphQLError } from 'graphql';
import get from 'lodash/get';
import omitDeep from 'omit-deep-lodash';
import REFRESH_TOKEN from '@/graphql/schema/mutations/refreshToken.graphql';

interface IRefreshToken {
  RefreshToken: string;
}

function isRefreshRequest(operation: GraphQLRequest) {
  return operation.operationName === 'RefreshToken';
}

// Returns accesstoken if opoeration is not a refresh token request
function returnTokenDependingOnOperation(operation: GraphQLRequest) {
  if (isRefreshRequest(operation)) return getCookie('refreshToken') || '';
  return getCookie('token') || '';
}
export const makeClient = () => {
  // const reFreshToken = getCookie('refreshToken');
  // console.log('a', reFreshToken);
  // const token = getCookie('token');
  // console.log('a', token);
  // const router = useRouter();

  const httpLink = new HttpLink({
    uri: `${process.env.BASE_URL}/graphql` || '',
    credentials: 'same-origin',
  });

  const authLink = setContext((operation, { headers }) => {
    const token = returnTokenDependingOnOperation(operation);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
        'Access-Control-Allow-Origin': `${process.env.BASE_URL}/graphql` || '',
      },
    };
  });

  const refreshTokens = async () => {
    console.log('123');
    try {
      const refreshResolverResponse = await makeClient().mutate<{
        RefreshToken: IRefreshToken;
      }>({
        mutation: REFRESH_TOKEN,
      });
      console.log(refreshResolverResponse);
      const accessToken = refreshResolverResponse.data?.RefreshToken;
      console.log('refreshToken', accessToken);
      setCookie('token', accessToken || '');
      return accessToken;
    } catch (err) {
      console.log(err);
      deleteCookie('token');
      deleteCookie('refreshToken');
      // router.push('/login');
      return null;
    }
  };

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        console.log('err', err.extensions.code);
        if (err.extensions.code === 'UNAUTHENTICATED') {
          console.log('i was here');
          console.log('opt', operation.operationName);
          if (operation.operationName === 'RefreshToken') return;
          const observable = new Observable<FetchResult<Record<string, unknown>>>((observer) => {
            (async () => {
              try {
                const accessToken = await refreshTokens();

                if (!accessToken) {
                  throw new GraphQLError('Empty AccessToken');
                }

                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };

                forward(operation).subscribe(subscriber);
              } catch (err1) {
                observer.error(err1);
              }
            })();
          });
          // eslint-disable-next-line consistent-return
          return observable;
        }
      }
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const cleanTypenameLink = new ApolloLink((operation, forward) => {
    const def = getMainDefinition(operation.query);
    if (def && get(def, 'operation') === 'mutation') {
      // eslint-disable-next-line no-param-reassign
      operation.variables = omitDeep(operation.variables, ['__typename']);
    }
    return forward ? forward(operation) : null;
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({ stripDefer: true }),
            cleanTypenameLink,
            errorLink,
            authLink,
            httpLink,
          ])
        : ApolloLink.from([cleanTypenameLink, errorLink, authLink, httpLink]),
  });
};
