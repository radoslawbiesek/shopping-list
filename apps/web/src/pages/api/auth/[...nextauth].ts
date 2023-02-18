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

        const { user, token: accessToken } = response.data;

        return { ...user, id: String(user.id), accessToken };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (typeof user === 'object' && user.hasOwnProperty('accessToken')) {
        const { accessToken } = user as unknown as { accessToken: string };
        token.accessToken = accessToken;
      }

      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
};

export default NextAuth(authOptions);
