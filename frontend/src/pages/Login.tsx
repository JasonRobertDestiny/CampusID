import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { Button } from '../components';
import './Login.css';

export const Login: React.FC = () => {
  const { isConnected, connectWallet, isConnecting, error } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate('/home');
    }
  }, [isConnected, navigate]);

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

          <Button
            onClick={connectWallet}
            loading={isConnecting}
            fullWidth
            variant="primary"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>

          {error && <p className="error-message">{error}</p>}

          <p className="wallet-note">
            Please install ArgentX wallet extension to continue
          </p>
        </div>
      </div>
    </div>
  );
};