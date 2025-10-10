import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';
import { Loading } from './components';
import './App.css';
import './contexts/Toast.css';

// Lazy load route components for better performance
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const CheckIn = lazy(() => import('./pages/CheckIn').then(module => ({ default: module.CheckIn })));
const Store = lazy(() => import('./pages/Store').then(module => ({ default: module.Store })));
const History = lazy(() => import('./pages/History').then(module => ({ default: module.History })));

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <WalletProvider>
          <Router>
            <Suspense fallback={<Loading message="Loading..." />}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/checkin" element={<CheckIn />} />
                <Route path="/store" element={<Store />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </Suspense>
          </Router>
        </WalletProvider>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;