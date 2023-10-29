import NextLink from 'next/link';

import { Link } from '@nextui-org/react';

import { LoginForm } from 'components/auth/LoginForm';

export default function Login() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-2xl font-bold">Logowanie</h1>
      <LoginForm />
      <Link size="sm" href="/register" as={NextLink}>
        Nie masz konta? Zarejestruj się
      </Link>
    </div>
  );
}
