'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';

import * as authActions from 'actions/auth.actions';
import { registerRequestBodySchema } from 'api/src/auth/auth.schema';

export const defaultValues = {
  email: '',
  name: '',
  password: '',
};

export function RegisterForm() {
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
    resolver: zodResolver(registerRequestBodySchema),
  });

  const onSubmit = async (registerData: typeof defaultValues) => {
    try {
      startTransition(async () => {
        await authActions.register(registerData);
        router.push('/login');
      });
    } catch (error) {
      setError('root', { message: 'Coś poszło nie tak. Spróbuj ponownie później.' });
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
        {...register('name')}
        label="Nazwa użytkownika"
        isInvalid={!!errors.name?.message}
        errorMessage={errors.name?.message}
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
        Zarejestruj się
      </Button>
    </form>
  );
}
