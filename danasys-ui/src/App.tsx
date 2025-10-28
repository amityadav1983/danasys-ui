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
      console.log('🔍 App: Checking for OAuth2 success redirect...');
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      console.log('🔍 App: URL params:', Object.fromEntries(urlParams.entries()));
      console.log('🔍 App: Token found:', !!token);

      if (token) {
        console.log('🔍 App: OAuth2 token found, processing authentication...');

        // Store the token
        localStorage.setItem('authToken', token);
        console.log('🔍 App: Token stored in localStorage');

        // Fetch user details like regular login
        try {
          console.log('🔍 App: Calling getUserDetails API...');
          const userDetails = await api.get('/api/user/getUserDetails');
          console.log('🔍 App: getUserDetails response:', userDetails.data);

          localStorage.setItem('user', JSON.stringify(userDetails.data));
          localStorage.setItem('userLoggedIn', 'true');
          console.log('🔍 App: User details stored, login state set to true');

          // Clear URL and redirect to home (don't reload, just navigate)
          console.log('🔍 App: Clearing URL and redirecting to home...');
          window.history.replaceState({}, '', '/');
          window.location.href = '/'; // Force redirect to home
        } catch (error) {
          console.error('❌ App: Failed to fetch user details after OAuth:', error);
          // Clear token if API fails
          localStorage.removeItem('authToken');
        }
      } else {
        console.log('🔍 App: No OAuth2 token found, normal app load');
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
