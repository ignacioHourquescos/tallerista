import React, { createContext, useContext, useState, useCallback } from 'react';

export type ViewMode = 'kits' | 'lubricantes';

interface ViewContextType {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
}

const ViewContext = createContext<ViewContextType>({
  activeView: 'kits',
  setActiveView: () => {},
});

export const useView = () => useContext(ViewContext);

export const ViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewMode>('kits');

  return (
    <ViewContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </ViewContext.Provider>
  );
};

export default ViewContext;

