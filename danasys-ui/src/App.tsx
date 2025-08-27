import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppWithRouting from './Routes';
import LoginGuard from './components/LoginGuard';
import { SearchProvider } from './contexts/SearchContext';

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
