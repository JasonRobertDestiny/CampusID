import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { StudentNFTService, CampusTokenService } from '../services';
import { MockStudentNFTService, MockCampusTokenService } from '../services/mockServices';
import { Button, Card, Loading } from '../components';
import { AvatarPicker } from '../components/AvatarPicker';
import { shortAddress } from '../utils/helpers';
import './Home.css';

export const Home: React.FC = () => {
  const { account, address, isConnected, disconnectWallet } = useWallet();
  const { isDemoMode } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasNFT, setHasNFT] = useState(false);
  const [balance, setBalance] = useState('0');
  const [studentInfo, setStudentInfo] = useState({
    avatarUri: '',
    studentName: '',
    studentId: '',
  });
  const [showMintForm, setShowMintForm] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [minting, setMinting] = useState(false);

  const nftService = useMemo(
    () => (isDemoMode ? new MockStudentNFTService() : new StudentNFTService(isDemoMode)),
    [isDemoMode]
  );
  const tokenService = useMemo(
    () => (isDemoMode ? new MockCampusTokenService() : new CampusTokenService(isDemoMode)),
    [isDemoMode]
  );

  const loadData = useCallback(async () => {
    // In production mode, we need wallet connection
    if (!isDemoMode && (!account || !address)) {
      console.log('Production mode requires wallet connection');
      return;
    }

    try {
      setLoading(true);

      // Initialize services
      if (isDemoMode) {
        // Create a dummy account for mock services (they don't actually use it)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dummyAccount = account || ({ address: 'demo-address' } as any);
        nftService.initialize(dummyAccount);
        tokenService.initialize(dummyAccount);
      } else if (account) {
        // Real services require actual account
        nftService.initialize(account);
        tokenService.initialize(account);
      }

      const userAddress = isDemoMode ? (address || 'demo-address') : (address || '0x1234...5678');
      const [nftExists, tokenBalance] = await Promise.all([
        nftService.hasNFT(userAddress),
        tokenService.getBalance(userAddress),
      ]);

      setHasNFT(nftExists);
      setBalance(tokenBalance);

      if (nftExists) {
        const info = await nftService.getStudentInfo('1');
        setStudentInfo(info);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [account, address, isDemoMode, nftService, tokenService, showToast]);

  useEffect(() => {
    // In demo mode, we can proceed without wallet connection
    if (!isDemoMode && !isConnected) {
      navigate('/');
      return;
    }

    void loadData();
  }, [isDemoMode, isConnected, loadData, navigate]);

  const handleMintNFT = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDemoMode && !account) return;

    // Validate avatar selection
    if (!selectedAvatar) {
      showToast('Please select an avatar first!', 'warning');
      return;
    }

    try {
      setMinting(true);
      const formData = new FormData(e.currentTarget);
      const avatarUri = selectedAvatar;
      const studentName = formData.get('name') as string;
      const studentId = formData.get('id') as string;

      // Validate inputs
      if (!studentName || !studentId) {
        showToast('Please fill in all fields', 'warning');
        setMinting(false);
        return;
      }

      await nftService.mintNFT(avatarUri, studentName, studentId);
      showToast('Student NFT minted successfully! 🎉', 'success');
      await loadData();
      setShowMintForm(false);
      setSelectedAvatar('');
    } catch (error) {
      console.error('Error minting NFT:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to mint NFT';
      showToast(errorMessage, 'error');
    } finally {
      setMinting(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    navigate('/');
  };

  if (loading) {
    return <Loading message="Loading your profile..." />;
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h2>🎓 Campus ID</h2>
        <div className="header-actions">
          {isDemoMode && <span className="demo-badge">Demo Mode</span>}
          <span className="address-display">{shortAddress(address || '0x1234...5678')}</span>
          <Button onClick={handleDisconnect} variant="secondary">
            Disconnect
          </Button>
        </div>
      </header>

      <div className="home-content">
        {isDemoMode && (
          <Card className="demo-notice">
            <p>
              💡 <strong>Demo Mode Active:</strong> You're experiencing the app without deploying contracts. All data is stored locally.
            </p>
          </Card>
        )}

        <div className="balance-card">
          <h3>Campus Points Balance</h3>
          <p className="balance-amount">{balance} CPT</p>
        </div>

        {!hasNFT && !showMintForm && (
          <Card className="nft-prompt">
            <h3>Get Your Student Certificate</h3>
            <p>Mint your NFT student certificate to access campus features</p>
            <Button onClick={() => setShowMintForm(true)} fullWidth>
              Mint Student NFT
            </Button>
          </Card>
        )}

        {showMintForm && (
          <Card className="mint-form-card">
            <h3>Create Student Certificate</h3>
            <form onSubmit={handleMintNFT} className="mint-form">
              {!showAvatarPicker ? (
                <>
                  <div className="form-group">
                    <label>Choose Avatar {!selectedAvatar && <span className="required">*</span>}</label>
                    <Button
                      type="button"
                      onClick={() => setShowAvatarPicker(true)}
                      fullWidth
                      variant="secondary"
                    >
                      {selectedAvatar ? '✅ Avatar Selected - Click to Change' : '📸 Select Avatar (Required)'}
                    </Button>
                    {selectedAvatar && (
                      <div className="avatar-preview-small">
                        <img src={selectedAvatar} alt="Selected avatar" />
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Student Name <span className="required">*</span></label>
                    <input type="text" name="name" placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label>Student ID <span className="required">*</span></label>
                    <input
                      type="text"
                      name="id"
                      placeholder="Student ID"
                      defaultValue={`STU${Date.now().toString().slice(-6)}`}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <Button
                      type="submit"
                      loading={minting}
                      fullWidth
                      disabled={!selectedAvatar || minting}
                    >
                      {minting ? 'Minting...' : selectedAvatar ? 'Mint NFT' : 'Select Avatar First'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowMintForm(false);
                        setSelectedAvatar('');
                      }}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <AvatarPicker
                    onSelect={setSelectedAvatar}
                    currentAvatar={selectedAvatar}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowAvatarPicker(false)}
                    fullWidth
                  >
                    Continue
                  </Button>
                </>
              )}
            </form>
          </Card>
        )}

        {hasNFT && (
          <Card className="student-card">
            <div className="card-header">
              <h3>Student Certificate</h3>
              <span className="nft-badge">NFT</span>
            </div>
            <div className="card-content">
              <div className="avatar">
                {studentInfo.avatarUri ? (
                  <img src={studentInfo.avatarUri} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">👤</div>
                )}
              </div>
              <div className="student-details">
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{studentInfo.studentName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">ID:</span>
                  <span className="value">{studentInfo.studentId}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {hasNFT && (
          <div className="action-buttons">
            <Button onClick={() => navigate('/checkin')} fullWidth>
              📝 Check In
            </Button>
            <Button onClick={() => navigate('/store')} fullWidth variant="secondary">
              🛒 Campus Store
            </Button>
            <Button onClick={() => navigate('/history')} fullWidth variant="secondary">
              📜 History
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};