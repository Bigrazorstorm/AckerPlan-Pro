'use client';

import { ReactNode } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

// This provider is intended to be used in a top-level client boundary
// to ensure that Firebase is initialized only once.
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebase = initializeFirebase();
  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}
