'use server';

import dataService from '@/services';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Session } from '@/services/types';

const SESSION_COOKIE_NAME = 'mock_session';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password');
    
    // Hardcoded credentials for mock user from mock data service
    if (
        (email === 'john.doe@example.com' && password === 'password') ||
        (email === 'gerd.wildmann@example.com' && password === 'password')
    ) {
      const mockSession = await dataService.getSession(email);
      cookies().set(SESSION_COOKIE_NAME, JSON.stringify(mockSession), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
    } else {
      return 'invalidCredentials';
    }
  } catch (error) {
    console.error(error);
    return 'authenticationError';
  }
  
  redirect('/');
}

export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/login');
}

export async function getSession(): Promise<Session | null> {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
    if (!sessionCookie) {
        return null;
    }
    try {
        return JSON.parse(sessionCookie.value);
    } catch {
        return null;
    }
}
