'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { ErrorOption, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import * as authService from '../../../services/auth.service';

import { Input } from '../../ui/input/Input';
import { Button } from '../../ui/button/Button';
import { ErrorMessage } from '../../error-message';

export function RegisterForm() {
  const router = useRouter();

  const defaultValues = {
    email: '',
    name: '',
    password: '',
  };

  const schema = z.object({
    email: z
      .string()
      .min(1, { message: 'Email jest wymagany' })
      .max(50, { message: 'Email nie może mieć więcej niż 50 znaków' })
      .email({ message: 'Email jest nieprawidłowy' }),
    name: z
      .string()
      .min(1, { message: 'Nazwa użytkownika jest wymagana' })
      .min(4, { message: 'Nazwa użytkownika nie może mieć mniej niż 4 znaki' })
      .max(25, { message: 'Nazwa użytkownika nie może mieć więcej niż 25 znaków' }),
    password: z
      .string()
      .min(1, { message: 'Hasło jest wymagane' })
      .min(8, { message: 'Hasło musi mieć co najmniej 8 znaków' })
      .max(16, { message: 'Hasło nie może mieć więcej niż 16 znaków' }),
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
      await authService.register(loginData);
      router.push('/login');
    } catch (error) {
      if (error instanceof authService.register.Error) {
        setRootError({ message: error.data.message });
      } else {
        console.error(error);
        setRootError({ message: 'Coś poszło nie tak. Spróbuj ponownie później.' });
      }
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
        {...register('name')}
        label="Nazwa użytkownika"
        placeholder="Nazwa użytkownika"
        errorMessage={errors.name?.message}
      />
      <Input
        {...register('password')}
        label="Hasło"
        placeholder="Hasło"
        type="password"
        errorMessage={errors.password?.message}
      />
      {errors.root?.message && <ErrorMessage className="mt-6">{errors.root.message}</ErrorMessage>}
      <Button
        variant="primary"
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting}
        className="mt-6"
      >
        Zarejestruj się
      </Button>
    </form>
  );
}
