import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { Login, Home, CheckIn, Store, History } from './pages';
import './App.css';

function App() {
  return (
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
  );
}

export default App;