import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import * as authService from '../../../services/auth.service';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const response = await authService.login(
          credentials as { email: string; password: string },
        );

        if (!response.ok) {
          return null;
        }

        const { user } = response.data;

        return { ...user, id: String(user.id) };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
};

export default NextAuth(authOptions);
