import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components';
import './Login.css';

export const Login: React.FC = () => {
  const { isConnected, connectWallet, isConnecting, error } = useWallet();
  const { isDemoMode, setDemoMode } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected || isDemoMode) {
      navigate('/home');
    }
  }, [isConnected, isDemoMode, navigate]);

  const handleDemoMode = () => {
    setDemoMode(true);
    navigate('/home');
  };

  const handleWalletConnect = async () => {
    setDemoMode(false);
    await connectWallet();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">🎓 Campus ID</h1>
          <p className="login-subtitle">Web3 Digital Student Identity</p>
        </div>

        <div className="login-content">
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🆔</span>
              <span>NFT Student Certificate</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🪙</span>
              <span>Campus Points (CPT)</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛒</span>
              <span>Campus Store</span>
            </div>
          </div>

          <div className="auth-buttons">
            <Button
              onClick={handleDemoMode}
              fullWidth
              variant="primary"
            >
              🚀 Try Demo Mode
            </Button>

            <div className="divider">
              <span>or</span>
            </div>

            <Button
              onClick={handleWalletConnect}
              loading={isConnecting}
              fullWidth
              variant="secondary"
            >
              {isConnecting ? 'Connecting...' : '🔐 Connect Wallet'}
            </Button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="info-cards">
            <div className="info-card">
              <h4>Demo Mode</h4>
              <p>Try all features instantly without blockchain connection. Perfect for testing!</p>
            </div>
            <div className="info-card">
              <h4>Wallet Mode</h4>
              <p>Connect ArgentX wallet for real blockchain transactions on StarkNet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};