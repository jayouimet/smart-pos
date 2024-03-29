// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      organization_role?: string;
      organization_id?: string;
    } & DefaultSession['user'];
    token: string;
  }

  interface User extends DefaultUser {
    organization_id?: string;
    organization_role?: string;
    system_role: string;
    email: string;
    password_hash: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string;
    id: string;
    image: string | null | undefined;
    organization_id?: string;
    organization_role?: string;
  }
}
