import { useState, useEffect } from 'react';

export function useCurrentUserId() {
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('jeryung-user-id');
    if (stored) {
      setId(Number(stored));
    }
  }, []);

  return id;
}
