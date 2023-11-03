'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@nextui-org/react';

import * as authActions from 'actions/auth.actions';
import { registerRequestBodySchema } from 'api/src/auth/auth.schema';
import { Form } from 'components/form/Form';

export const defaultValues = {
  email: '',
  name: '',
  password: '',
};

export function RegisterForm() {
  const router = useRouter();

  const onSubmit = async (registerData: typeof defaultValues) => {
    await authActions.register(registerData);
    router.push('/login');
  };

  return (
    <Form onSubmit={onSubmit} schema={registerRequestBodySchema} defaultValues={defaultValues}>
      <Input name="email" label="Email" isRequired />
      <Input name="name" label="Nazwa użytkownika" isRequired />
      <Input name="password" label="Hasło" type="password" isRequired />
      <Button type="submit" color="primary" fullWidth>
        Zarejestruj się
      </Button>
    </Form>
  );
}
