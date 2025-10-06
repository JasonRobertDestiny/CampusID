import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';
import { Login, Home, CheckIn, Store, History } from './pages';
import './App.css';
import './contexts/Toast.css';

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <WalletProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/checkin" element={<CheckIn />} />
              <Route path="/store" element={<Store />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Router>
        </WalletProvider>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;