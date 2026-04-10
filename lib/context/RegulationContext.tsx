"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RegulationContextType {
  activeRegulationId: string | null;
  setActiveRegulationId: (id: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const RegulationContext = createContext<RegulationContextType | undefined>(undefined);

export function RegulationProvider({ children }: { children: ReactNode }) {
  const [activeRegulationId, setActiveRegulationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <RegulationContext.Provider value={{
      activeRegulationId,
      setActiveRegulationId,
      isLoading,
      setIsLoading
    }}>
      {children}
    </RegulationContext.Provider>
  );
}

export function useRegulation() {
  const context = useContext(RegulationContext);
  if (context === undefined) {
    throw new Error('useRegulation must be used within a RegulationProvider');
  }
  return context;
}
