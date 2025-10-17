'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchPublicKey } from '@/lib/fetcher';
import { Toaster, toast } from 'sonner';


const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const key = await fetchPublicKey();
        setPublicKey(key);
      } catch {
        setError('Failed to load public key');
        toast.error('Could not load public key from server.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AppContext.Provider value={{ publicKey, loading, error }}>
      <Toaster />
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
