'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const checkCookiePreferences = () => {
    if (typeof window === 'undefined') return false;
    
    const cookieConsent = localStorage.getItem('cookie-consent');
    const cookiePreferences = localStorage.getItem('cookie-preferences');
    
    if (!cookieConsent || !cookiePreferences) return false;
    
    try {
      const prefs = JSON.parse(cookiePreferences);
      return prefs.preferences === true;
    } catch {
      return false;
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleClick = () => {
    const canSave = checkCookiePreferences();
    console.log('Theme toggle clicked. Current theme:', theme, 'Can save:', canSave);
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
}
