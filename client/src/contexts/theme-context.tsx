import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

export type ColorTheme = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';

export interface ThemeSettings {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (settings: Partial<ThemeSettings>) => void;
  toggleMode: () => void;
}

const defaultSettings: ThemeSettings = {
  mode: 'light',
  colorTheme: 'blue',
  fontSize: 'medium',
  compactMode: false
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('theme-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('theme-settings', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleMode = () => {
    updateSettings({ mode: settings.mode === 'light' ? 'dark' : 'light' });
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme mode
    if (settings.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply color theme
    root.setAttribute('data-color-theme', settings.colorTheme);

    // Apply font size
    root.setAttribute('data-font-size', settings.fontSize);

    // Apply compact mode
    if (settings.compactMode) {
      root.classList.add('compact');
    } else {
      root.classList.remove('compact');
    }
  }, [settings]);

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}