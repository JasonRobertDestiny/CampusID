import React, { useState } from 'react';
import { DEMO_AVATARS } from '../utils/mockData';
import './AvatarPicker.css';

interface AvatarPickerProps {
  onSelect: (avatarUrl: string) => void;
  currentAvatar?: string;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  onSelect,
  currentAvatar,
}) => {
  const [selected, setSelected] = useState(currentAvatar || DEMO_AVATARS[0]);
  const [customUrl, setCustomUrl] = useState('');

  const handleSelect = (url: string) => {
    setSelected(url);
    onSelect(url);
  };

  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      handleSelect(customUrl);
    }
  };

  return (
    <div className="avatar-picker">
      <div className="avatar-preview">
        <img src={selected} alt="Selected avatar" />
      </div>

      <div className="avatar-grid">
        {DEMO_AVATARS.map((url, index) => (
          <div
            key={index}
            className={`avatar-option ${selected === url ? 'selected' : ''}`}
            onClick={() => handleSelect(url)}
          >
            <img src={url} alt={`Avatar ${index + 1}`} />
          </div>
        ))}
      </div>

      <div className="custom-avatar">
        <input
          type="text"
          placeholder="Or enter custom avatar URL"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          className="custom-input"
        />
        <button onClick={handleCustomUrl} className="custom-button">
          Use Custom
        </button>
      </div>
    </div>
  );
};