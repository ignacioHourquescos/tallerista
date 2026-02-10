import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  brandFilter: string;
  setBrandFilter: (brand: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brandFilter, setBrandFilter] = useState<string>('');

  return (
    <FilterContext.Provider value={{ brandFilter, setBrandFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

