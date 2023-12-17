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
        const queryUserRes = await queryUserByEmail({
          email: credentials.email ?? '',
        });

        let user: User;

        if (credentials.action === 'register') {
          if (!queryUserRes) {
            const registerRes = await registerUser({
              email: credentials.email,
              password_hash: password_hash,
              first_name: credentials.first_name,
              last_name: credentials.last_name,
              organization_id: credentials.organization_id,
            });

            user = {
              id: registerRes.id,
              email: registerRes.email,
              system_role: registerRes.system_role.name,
              organization_role: registerRes.organization_role.name,
              password_hash: registerRes.password_hash,
              organization_id: registerRes.organization_id
            }
          } else {
            // User already exists
            return null;
          }
          // if the user already exist, persist the id & role in the user object
        } else {
          if (queryUserRes) {
            user = {
              id: queryUserRes.id,
              email: queryUserRes.email,
              system_role: queryUserRes.system_role.name,
              organization_role: queryUserRes.organization_role.name,
              password_hash: queryUserRes.password_hash,
              organization_id: queryUserRes.organization_id
            };
          } else {
            // User does not already exists
            return null;
          }
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
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text", placeholder: "Action" },
        first_name: { label: "First name", type: "text", placeholder: "First name" },
        last_name: { label: "Last name", type: "text", placeholder: "Last name" },
        organization_id: { label: "Organization ID", type: "text", placeholder: "Organization ID" },
      }
    })
  ],
  session: { strategy: 'jwt', maxAge: 604800 }, // maxAge in seconds. 604800 sec = 7 days
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.system_role;
        token.organization_role = user.organization_role;
        token.organization_id = user.organization_id;
      }

      if (token.id) {
        const queryUserRes = await queryUserByPk({
          id: token.id,
        });

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
        session.user.organization_role = token.organization_role;
        session.user.image = token.image;
        session.user.organization_id = token.organization_id;
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
        role: token?.role,
        organization_role: token?.organization_role,
        name: token?.name,
        image: token?.image,
        organization_id: token?.organization_id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['user', 'anonymous', 'admin'],
          'x-hasura-default-role': token?.role,
          'x-hasura-organization-role': token?.organization_role,
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
        organization_role: decodedToken.organization_role,
        name: decodedToken.name,
        image: decodedToken.image,
        organization_id: decodedToken.organization_id,
        iat: decodedToken.iat,
        exp: decodedToken.exp,
        'https://hasura.io/jwt/claims':
          decodedToken['https://hasura.io/jwt/claims'],
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

async function queryUserByEmail({ email }: { email: string }) {
  const searchUserQuery = `
      query queryUserByEmail(
        $email: String!,
      ) {
        users (
          where: {
            email: { _eq: $email}
          }
        ) {
          id
          email
          password_hash
          organization_id
          organization_role {
            id
            name
          }
          system_role {
            id
            name
          }
        }
      }
    `;

  const graphqlQuery = {
    operationName: 'queryUserByEmail',
    query: searchUserQuery,
    variables: { email: email },
  };

  const result = await axios.request({
    ...config.gqlConfig.options,
    data: graphqlQuery,
  });

  console.log(result.data)

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
          email
          password_hash
          organization_id
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
  email,
  password_hash,
  first_name,
  last_name,
  organization_id,
}: {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  organization_id: string;
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

  const organizationRoleQuery = `
    query organizationRoleQuery(
      $role: String!,
    ) {
      organization_roles (
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
                email
                password_hash
                organization_role {
                  id
                  name
                }
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

  const orgRoleGraphqlQuery = {
    operationName: 'organizationRoleQuery',
    query: organizationRoleQuery,
    variables: { role: 'member' },
  };

  const result_org_role = await axios.request({
    ...config.gqlConfig.options,
    data: orgRoleGraphqlQuery,
  });

  if (!result_org_role?.data?.data || result_org_role?.data?.data?.organization_roles?.length == 0) {
    throw new Error('Member role not found');
  }

  const org_role_id = result_org_role.data.data.organization_roles[0].id;

  const graphqlMutation = {
    operationName: 'registerMutation',
    query: registerMutation,
    variables: {
      user: {
        email: email,
        password_hash: password_hash,
        first_name: first_name,
        last_name: last_name,
        system_role_id: role_id,
        organization_role_id: org_role_id,
        organization_id: organization_id,
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
