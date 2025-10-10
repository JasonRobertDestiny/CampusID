import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from './Button';
import { shortAddress } from '../utils/helpers';
import './StatusBar.css';

interface StatusBarProps {
  title: string;
  description?: string;
  backTo?: string;
  actions?: React.ReactNode;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  title,
  description,
  backTo,
  actions,
}) => {
  const navigate = useNavigate();
  const { isDemoMode, setDemoMode } = useApp();
  const { isConnected, address, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const { showToast } = useToast();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const handleToggleMode = async () => {
    const nextValue = !isDemoMode;
    setDemoMode(nextValue);
    if (!nextValue && !isConnected) {
      showToast('Production mode activated. Please connect your wallet to continue.', 'info');
    }
    if (nextValue) {
      showToast('Demo mode enabled. Blockchain calls are now simulated.', 'info');
    }
  };

  const handleWalletAction = async () => {
    if (isConnected) {
      await disconnectWallet();
      showToast('Wallet disconnected.', 'info');
      return;
    }
    await connectWallet();
  };

  return (
    <div className="status-bar">
      <div className="status-left">
        <button className="back-button" onClick={handleBack} aria-label="Go back">
          ←
        </button>
        <div className="status-titles">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>

      <div className="status-right">
        <button
          type="button"
          className={`mode-pill ${isDemoMode ? 'demo' : 'live'}`}
          onClick={handleToggleMode}
        >
          <span className="pill-indicator" />
          {isDemoMode ? 'Demo Mode' : 'Live Mode'}
        </button>

        <div className="wallet-section">
          {isConnected ? (
            <>
              <span className="wallet-address">{shortAddress(address || '')}</span>
              <Button onClick={handleWalletAction} variant="secondary" size="small">
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              onClick={handleWalletAction}
              loading={isConnecting}
              variant="primary"
              size="small"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>

        {actions && <div className="status-actions">{actions}</div>}
      </div>
    </div>
  );
};
