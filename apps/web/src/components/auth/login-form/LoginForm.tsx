'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { ErrorOption, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Input } from '../../ui/input/Input';
import { Button } from '../../ui/button/Button';
import { ErrorMessage } from '../../error-message';

export function LoginForm() {
  const router = useRouter();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const setRootError = (error: ErrorOption) => {
    setError('root', error);
  };

  const clearRootError = () => {
    clearErrors('root');
  };

  const onSubmit = async (loginData: typeof defaultValues) => {
    setIsSubmitting(true);
    try {
      const response = await signIn('credentials', loginData);
      console.log(response);
    } catch (error) {
      setRootError({ message: 'Podany email lub hasło są nieprawidłowe' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={clearRootError}>
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
