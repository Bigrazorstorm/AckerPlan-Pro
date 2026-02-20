'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Company, Session } from '@/services/types';
import dataService from '@/services';

interface SessionContextType {
  session: Session | null;
  loading: boolean;
  activeCompany: Company | null;
  switchCompany: (companyId: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await dataService.getSession();
        setSession(sessionData);
        // Set the first company as active by default
        if (sessionData.companies.length > 0) {
          // You could enhance this to use localStorage to remember the last selected company
          setActiveCompany(sessionData.companies[0]);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const switchCompany = (companyId: string) => {
    const company = session?.companies.find(c => c.id === companyId);
    if (company) {
      setActiveCompany(company);
      // You could also save this preference to localStorage here
    }
  };

  const value = { session, loading, activeCompany, switchCompany };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
