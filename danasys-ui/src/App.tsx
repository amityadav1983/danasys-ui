import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import AppWithRouting from './Routes';
import LoginGuard from './components/LoginGuard';
import { SearchProvider } from './contexts/SearchContext';
import api from './services/api';

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <LoginGuard>
          <AppWithRouting />
        </LoginGuard>
      </SearchProvider>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
