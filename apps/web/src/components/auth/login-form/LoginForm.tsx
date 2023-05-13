'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import * as authActions from '../../../actions/auth.actions';

import { Input } from '../../ui/input/Input';
import { Button } from '../../ui/button/Button';
import { ErrorMessage } from '../../error-message';

const defaultValues = {
  email: '',
  password: '',
};

const schema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email jest wymagany' })
    .email({ message: 'Email jest nieprawidłowy' }),
  password: z.string().min(1, { message: 'Hasło jest wymagane' }),
});

export function LoginForm() {
  const [, startTransition] = React.useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const onSubmit = async (loginData: typeof defaultValues) => {
    try {
      startTransition(async () => {
        await authActions.login(loginData);
        router.push('/');
      });
    } catch (error) {
      setError('root', { message: 'Podany email lub hasło są nieprawidłowe' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={() => clearErrors('root')}>
      <Input
        {...register('email')}
        label="Email"
        placeholder="Email"
        errorMessage={errors.email?.message}
      />
      <Input
        {...register('password')}
        label="Hasło"
        placeholder="Hasło"
        type="password"
        errorMessage={errors.password?.message}
      />
      {errors.root?.message && <ErrorMessage>{errors.root.message}</ErrorMessage>}
      <Button
        variant="primary"
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting}
        className="mt-6"
      >
        Zaloguj się
      </Button>
    </form>
  );
}
