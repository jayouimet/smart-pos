import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions, User } from 'next-auth';
import jwt from 'jsonwebtoken';
import type { JWT } from 'next-auth/jwt';
import axios from 'axios';
import { config } from '@utils/config';
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const password_hash = await bcrypt.hash(credentials.password, 10);

        // we query the database to check if the user already exist
        const queryUserRes = await queryUserByUsername({
          username: credentials.username ?? '',
        });

        let user: User;

        if (!queryUserRes) {
          const registerRes = await registerUser({
            username: credentials.username,
            password_hash: password_hash
          });

          user = {
            id: registerRes.id,
            username: registerRes.username,
            system_role: registerRes.system_role.name,
            password_hash: registerRes.password_hash
          }
          // if the user already exist, persist the id & role in the user object
        } else {
          user = {
            id: queryUserRes.id,
            username: queryUserRes.username,
            system_role: queryUserRes.system_role.name,
            password_hash: queryUserRes.password_hash
          };
        }

        const match = await bcrypt.compare(credentials.password, user.password_hash);

        if (!match) {
          return null;
        }

        return user;
      },
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" }
      }
    })
  ],
  session: { strategy: 'jwt', maxAge: 604800 }, // maxAge in seconds. 604800 sec = 7 days
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.system_role;
      }

      if (token.id) {
        const queryUserRes = await queryUserByPk({
          id: token.id,
        });
        token.profileCompleted = queryUserRes.profile_completed;

        /*if (queryUserRes.organization_users) {
            token.org_ids = queryUserRes.organization_users.map((organization_user) => {
              return organization_user.organization.id;
            });
          }*/
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image;
      }
      const encodedToken = jwt.sign(
        token as object,
        config.nextAuth.secret as jwt.Secret,
        {
          algorithm: config.nextAuth.algorithm as jwt.Algorithm,
        },
      );
      session.token = encodedToken;
      return session;
    },
    async signIn({ user, account, profile }) {
      if (user) {
        return true;
      }
      return false;
    }
  },
  jwt: {
    secret: config.nextAuth.secret,
    encode: async ({ secret, token }): Promise<string> => {
      const jwtClaims = {
        id: token?.id,
        role: token?.system_role,
        name: token?.name,
        image: token?.image,
        profileCompleted: token?.profileCompleted,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['user', 'anonymous', 'admin'],
          'x-hasura-default-role': token?.system_role,
          'x-hasura-user-id': token?.id,
          // "x-hasura-allowed-organizations": token?.org_ids,
        },
      };
      const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: 'HS256' });
      return encodedToken;
    },
    decode: async ({ secret, token }): Promise<JWT | null> => {
      const decodedToken = jwt.verify(token as string, secret, {
        algorithms: ['HS256'],
      }) as jwt.JwtPayload;
      return {
        id: decodedToken.id,
        role: decodedToken.role,
        name: decodedToken.name,
        image: decodedToken.image,
        profileCompleted: decodedToken.profileCompleted,
        iat: decodedToken.iat,
        exp: decodedToken.exp,
        'https://hasura.io/jwt/claims':
          decodedToken['https://hasura.io/jwt/claims'],
      };
    },
  },
  pages: {
    // signIn: '/auth/signin',
    // signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

async function queryUserByUsername({ username }: { username: string }) {
  const searchUserQuery = `
      query queryUserByUsername(
        $username: String!,
      ) {
        users (
          where: {
            username: { _eq: $username}
          }
        ) {
          id
          username
          password_hash
          system_role {
            id
            name
          }
        }
      }
    `;

  const graphqlQuery = {
    operationName: 'queryUserByUsername',
    query: searchUserQuery,
    variables: { username: username },
  };

  const result = await axios.request({
    ...config.gqlConfig.options,
    data: graphqlQuery,
  });

  if (result.data.errors) {
    throw new Error(result.data.errors[0].message);
  }

  return result.data.data.users[0] ?? null;
}

async function queryUserByPk({ id }: { id: string }) {
  const searchUserQuery = `
      query queryUserByPk(
        $id: uuid!,
      ) {
        users_by_pk (
          id: $id
        ) {
          id
          username
          password_hash
          system_role {
            id
            name
          }
        }
      }
    `;

  const graphqlQuery = {
    operationName: 'queryUserByPk',
    query: searchUserQuery,
    variables: { id: id },
  };

  const result = await axios.request({
    ...config.gqlConfig.options,
    data: graphqlQuery,
  });

  if (result.data.errors) {
    throw new Error(result.data.errors[0].message);
  }

  return result.data.data.users_by_pk ?? null;
}

async function registerUser({
  username,
  password_hash
  // firstName,
  // lastName,
}: {
  username: string;
  password_hash: string;
  // firstName: string;
  // lastName: string;
}) {
  const roleQuery = `
      query roleQuery(
        $role: String!,
      ) {
        system_roles (
          where: {
            name: { _eq: $role}
          }
        ) {
          id
          name
        }
      }
    `;

  const registerMutation = `
      mutation registerMutation($user: users_insert_input!) {
        insert_users(objects: [$user]) {
            returning {
                id
                username
                password_hash
                system_role {
                    id
                    name
                }
            }
          }
      }
    `;

  const roleGraphqlQuery = {
    operationName: 'roleQuery',
    query: roleQuery,
    variables: { role: 'user' },
  };

  const result_role = await axios.request({
    ...config.gqlConfig.options,
    data: roleGraphqlQuery,
  });

  if (!result_role?.data?.data || result_role?.data?.data?.system_roles?.length == 0) {
    throw new Error('User role not found');
  }

  const role_id = result_role.data.data.system_roles[0].id;

  const graphqlMutation = {
    operationName: 'registerMutation',
    query: registerMutation,
    variables: {
      user: {
        username: username,
        password_hash: password_hash,
        // first_name: firstName,
        // last_name: lastName,
        system_role_id: role_id,
      },
    },
  };

  const result = await axios.request({
    ...config.gqlConfig.options,
    data: graphqlMutation,
  });

  if (result.data.errors) {
    throw new Error(result.data.errors[0].message);
  }

  return result.data.data.insert_users.returning[0];
}
