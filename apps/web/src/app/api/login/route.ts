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

const loginQuery = `
  query login(
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
  `

export async function POST(req: Request) {
    const { login } = await req.json();
    if (!login || !login.loginInput) {
        return NextResponse.json({ error: "Invalid value in request body" }, { status: 400 });
    }
    const { loginInput } = login;
    const { email, password } = loginInput;
    if (!email || !password) {
        return NextResponse.json({ error: "Missing email or password in request body" }, { status: 400 });
    }

    const graphqlQuery = {
        "operationName": "login",
        "query": loginQuery,
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

    if (result?.data?.data?.users?.length == 0) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const user = result.data.data.users[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return NextResponse.json({
        error: "Invalid credentials",
      }, {status: 401})
    }

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
