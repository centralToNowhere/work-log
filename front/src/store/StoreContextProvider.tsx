import React, { createContext, useContext } from 'react';
import { type CoreStoreInstance } from './CoreStore';

export const StoreContext = createContext<CoreStoreInstance | null>(null);

export const StoreProvider = ({
  store,
  children,
}: {
  store: CoreStoreInstance;
  children: React.ReactNode;
}) => <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return store;
};
