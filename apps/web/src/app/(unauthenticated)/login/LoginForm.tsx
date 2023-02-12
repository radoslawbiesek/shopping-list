'use client';

import { Input } from 'react-daisyui';

export function LoginForm() {
  return (
    <>
      <label htmlFor="email" className="block text-sm font-medium">
        Email
      </label>
      <Input name="email" placeholder="Email" color="accent" bordered className="block w-full" />
    </>
  );
}
