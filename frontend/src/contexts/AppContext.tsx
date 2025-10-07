import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { resolveDemoMode } from '../utils/helpers';

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
  const [isDemoMode, setIsDemoMode] = useState(() => resolveDemoMode());

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  const [language, setLanguageState] = useState<'en' | 'zh'>(() => {
    const saved = localStorage.getItem('language');
    return (saved as 'en' | 'zh') || 'en';
  });

  useEffect(() => {
    setIsDemoMode(true);
    try {
      localStorage.setItem('demoMode', 'true');
    } catch {
      // Ignore storage access issues; state already enforces demo mode
    }
  }, []);

  const setDemoMode = (value: boolean) => {
    setIsDemoMode(value);
    try {
      localStorage.setItem('demoMode', value.toString());
    } catch {
      // Ignore storage access issues; state still reflects the correct value
    }
  };
  useEffect(() => {
    try {
      localStorage.setItem('demoMode', isDemoMode.toString());
    } catch {
      // Ignore storage access issues to avoid breaking the app in restrictive environments
    }
  }, [isDemoMode]);


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

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};