import { useState, useEffect } from 'react';

/**
 * Hook générique pour synchroniser un état avec le LocalStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erreur lors de la lecture de localStorage[${key}]:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Erreur lors de l'écriture dans localStorage[${key}]:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
