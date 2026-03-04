'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type DrawerId =
  | 'none'
  | 'nav'
  | 'share'
  | 'wallet'
  | 'settings'
  | 'profile'
  | 'portal'
  | (string & {});

export type DrawerState = {
  open: boolean;
  id: DrawerId;
  payload?: unknown;
};

type Ctx = {
  state: DrawerState;
  openDrawer: (id: DrawerId, payload?: unknown) => void;
  closeDrawer: () => void;
  toggleDrawer: (id: DrawerId, payload?: unknown) => void;
};

const DrawersContext = createContext<Ctx | null>(null);

export function useDrawers(): Ctx {
  const v = useContext(DrawersContext);
  if (!v) throw new Error('useDrawers must be used within <DrawersProvider>');
  return v;
}

export default function DrawersProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DrawerState>({ open: false, id: 'none' });

  const openDrawer = useCallback((id: DrawerId, payload?: unknown) => {
    setState({ open: true, id, payload });
  }, []);

  const closeDrawer = useCallback(() => {
    setState((s) => ({ ...s, open: false, id: 'none', payload: undefined }));
  }, []);

  const toggleDrawer = useCallback((id: DrawerId, payload?: unknown) => {
    setState((s) => {
      const willOpen = !(s.open && s.id === id);
      return willOpen ? { open: true, id, payload } : { ...s, open: false, id: 'none', payload: undefined };
    });
  }, []);

  const value = useMemo<Ctx>(() => ({ state, openDrawer, closeDrawer, toggleDrawer }), [
    state,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  ]);

  return <DrawersContext.Provider value={value}>{children}</DrawersContext.Provider>;
}
