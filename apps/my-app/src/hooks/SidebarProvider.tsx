'use client';

import { Dispatch, SetStateAction, createContext, useContext } from 'react';

interface SideBarContextData {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}
export const SidebarContext = createContext<SideBarContextData | null>(null);

export const useSideBarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
};
