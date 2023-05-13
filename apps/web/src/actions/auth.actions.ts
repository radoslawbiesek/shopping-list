'use server';

import { cookies } from '../lib/cookies';

import * as authService from '../services/auth.service';

export async function register(data: Parameters<typeof authService.register>[0]) {
  return authService.register(data);
}

export async function login(data: Parameters<typeof authService.login>[0]) {
  const response = await authService.login(data);
  const { token } = response.data;
  cookies().set('token', token);

  return response.data;
}
