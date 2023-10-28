import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from "axios";

if (!process.env.HASURA_GRAPHQL_ENDPOINT) {
    throw new Error('No hasura endpoint configured')
}
  
if (!process.env.HASURA_ADMIN_SECRET) {
    throw new Error('No hasura admin secret configured')
}

const userQuery = `
  query userQuery(
    $email: String!,
  ) {
    users (
      where: {
        email: { _eq: $email}
      }
    ) {
      id
    }
  }
`

const roleQuery = `
  query roleQuery(
    $role: String!,
  ) {
    roles (
      where: {
        role: { _eq: $role}
      }
    ) {
      id
      role
    }
  }
`

const registerMutation = `
  mutation registerMutation($user: users_insert_input!) {
    insert_users(objects: [$user]) {
        returning {
            id
            username
            first_name
            last_name
            user_roles {
                id
                role {
                    id
                    role
                }
            }
        }
      }
  }
`

export async function POST(req: Request) {
    const { register } = await req.json();
    if (!register || !register.registerInput) {
        return NextResponse.json({ error: "Invalid value in request body" }, { status: 400 });
    }
    const { registerInput } = register;
    const { email, password, first_name, last_name, username } = registerInput;
    if (!email || !password || !first_name || !last_name || !username) {
        return NextResponse.json({ error: "Missing values in request body" }, { status: 400 });
    }

    const graphqlQuery = {
        "operationName": "userQuery",
        "query": userQuery,
        "variables": { email: email }
    };

    const options = {
        method: "POST",
        url: process.env.HASURA_GRAPHQL_ENDPOINT,
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
        },
        data: graphqlQuery
    };
  
    const result = await axios.request(options);

    if (!result?.data?.data || result?.data?.data?.users?.length > 0) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const roleGraphqlQuery = {
        "operationName": "roleQuery",
        "query": roleQuery,
        "variables": { role: "user" }
    };

    const options_role = {
        method: "POST",
        url: process.env.HASURA_GRAPHQL_ENDPOINT,
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
        },
        data: roleGraphqlQuery
    };
  
    const result_role = await axios.request(options_role);

    if (!result_role?.data?.data || result_role?.data?.data?.roles?.length == 0) {
        return NextResponse.json({ error: "User role not found" }, { status: 500 });
    }

    const role_id = result_role.data.data.roles[0].id;

    const password_hash = await bcrypt.hash(password, 10);

    const graphqlMutation = {
        "operationName": "registerMutation",
        "query": registerMutation,
        "variables": {
            user: {
                email: email,
                username: username,
                first_name: first_name,
                last_name: last_name,
                password_hash: password_hash,
                user_roles: {
                    data: [
                        {
                            role_id: role_id
                        }
                    ]
                }
            }
        }
    };

    const options_register = {
        method: "POST",
        url: process.env.HASURA_GRAPHQL_ENDPOINT,
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
        },
        data: graphqlMutation
    };

    const result_register = await axios.request(options_register);

    if (!result_register?.data?.data?.insert_users || result_register?.data.data?.insert_users?.returning.length == 0) {
        return NextResponse.json({ error: "An internal error occured when creating the account, try again later." }, { status: 500 });
    }

    const user = result_register.data.data.insert_users.returning[0];

    const roles = user.user_roles.map((user_role) => {
        return user_role.role.role;
    });

    const accessToken = jwt.sign(
        {
            'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': roles,
            'x-hasura-user-id': user.id.toString(),
            'x-hasura-username': user.username,
            'x-hasura-user-email': user.email,
            'x-hasura-first-name': user.first_name,
            'x-hasura-last-name': user.last_name,
            },
            iat: Math.floor(Date.now() / 1000) - 30,
        },
        process.env.JWT_SECRET,
        {
            algorithm: process.env.JWT_ALGORITHM,
            expiresIn: process.env.JWT_TOKEN_EXPIRES
        },
    )

    return NextResponse.json({ accessToken }, { status: 200 });
}
