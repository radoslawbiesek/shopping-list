import NextLink from 'next/link';

import { Link } from '@nextui-org/react';

import { RegisterForm } from 'components/auth/RegisterForm';

export default function Register() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-2xl font-bold">Rejestracja</h1>
      <RegisterForm />
      <Link size="sm" href="/login" as={NextLink}>
        Masz już konto? Zaloguj się
      </Link>
    </div>
  );
}
