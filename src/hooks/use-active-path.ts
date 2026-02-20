'use client';
import { usePathname } from 'next-intl/navigation';
import { useState, useEffect } from 'react';

/**
 * A client-side hook to safely determine the active navigation path without the locale prefix.
 * This avoids hydration errors by calculating the path only on the client.
 * @returns The current path without the locale prefix (e.g., '/machinery').
 */
export function useActivePath() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    // The pathname from next-intl's hook is already without the locale.
    setActivePath(pathname);
  }, [pathname]);

  return activePath;
}
