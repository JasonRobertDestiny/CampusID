import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AppContextType {
  isDemoMode: boolean;
  setDemoMode: (value: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const saved = localStorage.getItem('demoMode');
    return saved !== null ? saved === 'true' : true; // Default to demo mode
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  const [language, setLanguageState] = useState<'en' | 'zh'>(() => {
    const saved = localStorage.getItem('language');
    return (saved as 'en' | 'zh') || 'en';
  });

  const setDemoMode = (value: boolean) => {
    setIsDemoMode(value);
    localStorage.setItem('demoMode', value.toString());
  };

  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem('darkMode', newValue.toString());
  };

  const setLanguage = (lang: 'en' | 'zh') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <AppContext.Provider
      value={{
        isDemoMode,
        setDemoMode,
        isDarkMode,
        toggleDarkMode,
        language,
        setLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};