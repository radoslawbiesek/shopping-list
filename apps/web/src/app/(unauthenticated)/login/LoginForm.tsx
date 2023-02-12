'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Input } from '../../../components/form/input/Input';

export function LoginForm() {
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
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: typeof defaultValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <button className="mt-6 btn btn-primary btn-block" type="submit">
        Zaloguj się
      </button>
    </form>
  );
}
