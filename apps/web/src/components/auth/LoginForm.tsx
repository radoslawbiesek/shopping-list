'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Input } from '@nextui-org/react';

import * as authActions from 'actions/auth.actions';

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
      console.log(error);
      setError('root', { message: 'Podany email lub hasło są nieprawidłowe' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => clearErrors('root')}
      className="flex flex-col gap-4"
    >
      <Input
        {...register('email')}
        label="Email"
        isInvalid={!!errors.email?.message}
        errorMessage={errors.email?.message}
      />
      <Input
        {...register('password')}
        label="Hasło"
        type="password"
        isInvalid={!!errors.password?.message}
        errorMessage={errors.password?.message}
      />
      {errors.root?.message && <p className="text-danger">{errors.root.message}</p>}
      <Button
        type="submit"
        color="primary"
        fullWidth
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        Zaloguj się
      </Button>
    </form>
  );
}
