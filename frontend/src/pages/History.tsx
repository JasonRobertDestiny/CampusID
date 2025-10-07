import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useApp } from '../contexts/AppContext';
import { Button, Card, StatusBar } from '../components';
import { NETWORK_CONFIG } from '../utils/constants';
import { getExplorerTxUrl } from '../utils/helpers';
import type { TransactionRecord } from '../types';
import './History.css';

export const History: React.FC = () => {
  const { isConnected } = useWallet();
  const { isDemoMode } = useApp();
  const navigate = useNavigate();
  const [history, setHistory] = useState<TransactionRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'checkin' | 'purchase'>('all');

  const loadHistory = useCallback(() => {
    const storageKey = isDemoMode ? 'demo_history' : 'txHistory';
    const storedHistory = localStorage.getItem(storageKey);
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, [isDemoMode]);

  useEffect(() => {
    // In demo mode, we don't need wallet connection
    if (!isDemoMode && !isConnected) {
      navigate('/');
      return;
    }

    loadHistory();
  }, [isDemoMode, isConnected, loadHistory, navigate]);

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTypeIcon = (type: string) => {
    return type === 'checkin' ? '📝' : '🛒';
  };

  const getTypeLabel = (type: string) => {
    return type === 'checkin' ? 'Check-in' : 'Purchase';
  };

  return (
    <div className="history-page">
      <StatusBar
        title="Transaction History"
        description="Review your recent check-ins and purchases"
        backTo="/home"
        actions={
          <div className="history-status-actions">
            <Button size="small" onClick={() => navigate('/checkin')}>
              📝 Check In
            </Button>
            <Button size="small" variant="secondary" onClick={() => navigate('/store')}>
              🛒 Store
            </Button>
          </div>
        }
      />

      <div className="history-content">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-tab ${filter === 'checkin' ? 'active' : ''}`}
            onClick={() => setFilter('checkin')}
          >
            Check-ins
          </button>
          <button
            className={`filter-tab ${filter === 'purchase' ? 'active' : ''}`}
            onClick={() => setFilter('purchase')}
          >
            Purchases
          </button>
        </div>

        {filteredHistory.length === 0 ? (
          <Card className="empty-state">
            <div className="empty-icon">📜</div>
            <h3>No Transactions Yet</h3>
            <p>Your transaction history will appear here</p>
            <Button onClick={() => navigate('/checkin')} fullWidth>
              Make Your First Check-in
            </Button>
          </Card>
        ) : (
          <div className="history-list">
            {filteredHistory.map((record) => (
              <Card key={record.id} className="history-item">
                <div className="history-header">
                  <div className="history-type">
                    <span className="type-icon">{getTypeIcon(record.type)}</span>
                    <span className="type-label">{getTypeLabel(record.type)}</span>
                  </div>
                  <span
                    className={`amount ${
                      record.type === 'checkin' ? 'positive' : 'negative'
                    }`}
                  >
                    {record.type === 'checkin' ? '+' : '-'}
                    {record.amount} CPT
                  </span>
                </div>
                {record.description && (
                  <p className="history-description">{record.description}</p>
                )}
                <div className="history-footer">
                  <span className="history-time">{formatDate(record.timestamp)}</span>
                  {record.txHash && (
                    <a
                      href={getExplorerTxUrl(record.txHash, NETWORK_CONFIG.explorerUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-tx"
                    >
                      View →
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};