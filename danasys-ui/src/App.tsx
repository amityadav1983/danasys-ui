import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import AppWithRouting from './Routes';
import LoginGuard from './components/LoginGuard';
import { SearchProvider } from './contexts/SearchContext';
import api from './services/api';

function App() {
  useEffect(() => {
    // Handle OAuth2 success redirect
    const handleOAuthSuccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        // Store the token
        localStorage.setItem('authToken', token);

        // Fetch user details like regular login
        try {
          const userDetails = await api.get('/api/user/getUserDetails');
          localStorage.setItem('user', JSON.stringify(userDetails.data));
          localStorage.setItem('userLoggedIn', 'true');

          // Clear URL and reload to show logged in state
          window.history.replaceState({}, '', '/');
          window.location.reload();
        } catch (error) {
          console.error('Failed to fetch user details after OAuth:', error);
        }
      }
    };

    handleOAuthSuccess();
  }, []);

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
