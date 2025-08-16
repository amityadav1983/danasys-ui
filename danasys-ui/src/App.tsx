import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppWithRouting from './Routes';
import LoginGuard from './components/LoginGuard';

function App() {
  return (
    <BrowserRouter>
      <LoginGuard>
        <AppWithRouting />
      </LoginGuard>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
