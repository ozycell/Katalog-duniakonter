import { useState, useCallback } from "react";

/**
 * Web Contacts API Hook
 * Untuk mengakses kontak device di mobile browser yang support (Chrome Android)
 * Ref: https://developer.mozilla.org/en-US/docs/Web/openapi/ContactsManager
 */

interface ContactInfo {
  name: string[];
  tel: string[];
  email?: string[];
}

interface UseWebContactsReturn {
  selectContact: () => Promise<ContactInfo | null>;
  isSupported: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useWebContacts(): UseWebContactsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Web Contacts API is supported
  const isSupported =
    typeof window !== "undefined" &&
    "contacts" in navigator &&
    // @ts-ignore - ContactsManager is not in standard types yet
    navigator.contacts !== undefined;

  const selectContact = useCallback(async (): Promise<ContactInfo | null> => {
    setError(null);
    setIsLoading(true);

    try {
      // @ts-ignore - ContactsManager is not in standard types yet
      const contacts = navigator.contacts as ContactsManager;

      // Define properties to retrieve
      const props = ["name", "tel"] as const;

      // Select contacts (multiple = false for single selection)
      const results = await contacts.select(props, { multiple: false });

      if (results && results.length > 0) {
        return results[0] as ContactInfo;
      }

      return null;
    } catch (err: any) {
      // User cancelled or error occurred
      if (err.name === "AbortError") {
        // User cancelled, not a real error
        return null;
      }
      setError(err.message || "Gagal mengakses kontak");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    selectContact,
    isSupported,
    isLoading,
    error,
  };
}

// Type definitions for Web Contacts API
declare global {
  interface ContactsManager {
    select(
      properties: readonly ("name" | "tel" | "email" | "address" | "icon")[],
      options?: { multiple?: boolean }
    ): Promise<ContactInfo[]>;
  }

  interface Navigator {
    contacts?: ContactsManager;
  }
}
