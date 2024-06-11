import { useCallback } from 'react';

function useLocalStorage() {
  // Method to get an item from localStorage
  const getItem = useCallback((key: string) => {
    if (typeof window === 'undefined') {
      return null; // Return null if we're on the server
    }

    const storedValue = window.localStorage.getItem(key);
    try {
      return JSON.parse(storedValue as string); // Try to parse stored JSON
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return storedValue; // Return the raw string if parsing fails
    }
  }, []);

  // Method to set an item in localStorage
  const setItem = useCallback((key: string, value: any) => {
    if (typeof window === 'undefined') {
      return; // Do nothing if we're on the server
    }

    try {
      const valueToStore = JSON.stringify(value);
      localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, []);

  return { getItem, setItem };
}

export default useLocalStorage;
