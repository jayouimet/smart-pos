export const config = {
  gqlConfig: {
    url: process.env.HASURA_GRAPHQL_ENDPOINT,
    token: process.env.HASURA_ADMIN_SECRET,
    options: {
      method: 'POST',
      url: process.env.HASURA_GRAPHQL_ENDPOINT,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
      },
    },
  },
  oAuth: {
    googleId: process.env.GOOGLE_AUTH_ID,
    googleSecret: process.env.GOOGLE_AUTH_SECRET,
  },
  nextAuth: {
    url: process.env.NEXTAUTH_URL,
    secret: process.env.NEXTAUTH_SECRET,
    algorithm: process.env.NEXTAUTH_ALGORITHM,
  },
};
