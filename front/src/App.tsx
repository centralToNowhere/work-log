import { useState } from 'react';
import { ConfigProvider } from 'antd';
import { StoreProvider } from './store/StoreContextProvider';
import { createStore } from './store/CoreStore';
import { AppRouter } from './router';
import primaryTheme from './theme/Primary/theme';

import './App.css';
import { CoreStoreInstance } from './store/CoreStore';

function App() {
  const [store] = useState<CoreStoreInstance>(() => createStore());

  return (
    <ConfigProvider theme={primaryTheme}>
      <StoreProvider store={store}>
        <AppRouter />
      </StoreProvider>
    </ConfigProvider>
  );
}

export default App;
