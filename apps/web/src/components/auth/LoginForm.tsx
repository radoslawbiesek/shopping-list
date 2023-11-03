'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@nextui-org/react';

import * as authActions from 'actions/auth.actions';
import { loginRequestBodySchema } from 'api/src/auth/auth.schema';
import { Form } from 'components/form/Form';

const defaultValues = {
  email: '',
  password: '',
};

export function LoginForm() {
  const router = useRouter();

  const onSubmit = async (loginData: typeof defaultValues) => {
    await authActions.login(loginData);
    router.push('/');
  };

  return (
    <Form schema={loginRequestBodySchema} onSubmit={onSubmit} defaultValues={defaultValues}>
      <Input name="email" label="Email" isRequired />
      <Input name="password" label="Hasło" type="password" isRequired />
      <Button type="submit" color="primary" fullWidth>
        Zaloguj się
      </Button>
    </Form>
  );
}
