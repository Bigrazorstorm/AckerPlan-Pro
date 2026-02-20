'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Company, Session } from '@/services/types';

interface SessionContextType {
  session: Session | null;
  loading: boolean;
  activeCompany: Company | null;
  switchCompany: (companyId: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children, session: initialSession }: { children: ReactNode; session: Session | null }) {
  const [session] = useState(initialSession);
  const [loading] = useState(false); // Session is now loaded on the server, so no client loading state
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (session && session.companies.length > 0) {
      const lastCompanyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : null;
      const companyToSetActive = 
        session.companies.find(c => c.id === lastCompanyId) || session.companies[0];
      
      setActiveCompany(companyToSetActive);
    }
  }, [session]);

  const switchCompany = (companyId: string) => {
    const company = session?.companies.find(c => c.id === companyId);
    if (company) {
      setActiveCompany(company);
      localStorage.setItem('activeCompanyId', company.id);
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
