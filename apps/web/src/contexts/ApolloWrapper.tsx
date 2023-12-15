"use client";

import { HttpLink, split, from } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { useSession } from "next-auth/react";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from "@apollo/client/utilities";

function makeClient(session: any) {
  const wsLink = new GraphQLWsLink(createClient({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WEBSOCKET || '',
    connectionParams: async () => {
      return {
        headers: {
          "authorization": `Bearer ${session?.token}`,
        },
      };
    },
  }));

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT,
    fetchOptions: { cache: "no-store" },
    headers: {
      "authorization": session?.token ? `Bearer ${session.token}` : ""
    }
  })

  const splitLink = split(
    ({ query }: any) => {
      const definition = getMainDefinition(query);

      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: 
      typeof window === "undefined"
        ? from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            splitLink
          ])
        : from([
          splitLink
        ])
  });
}

export function ApolloWrapper({ children }: any) {
  const { data: session } = useSession();

  return (
    <ApolloNextAppProvider makeClient={() => makeClient(session)}>
      {children}
    </ApolloNextAppProvider>
  );
}