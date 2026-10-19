import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, translations } from '../i18n/languages';

interface LanguageContextType {
  currentLanguage: string;
  isRtl: boolean;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  isRtl: false,
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<string>(() => {
    return localStorage.getItem('opriva_language') || 'en';
  });

  const activeLangOption = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);
  const isRtl = activeLangOption?.isRtl || false;

  useEffect(() => {
    localStorage.setItem('opriva_language', currentLanguage);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRtl]);

  const setLanguage = (code: string) => {
    setCurrentLanguageState(code);
  };

  const t = (key: string): string => {
    const langDict = translations[currentLanguage];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    const fallbackDict = translations['en'];
    if (fallbackDict && fallbackDict[key]) {
      return fallbackDict[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, isRtl, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
