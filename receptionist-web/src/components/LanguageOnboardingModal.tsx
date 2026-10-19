import React from 'react';
import { SUPPORTED_LANGUAGES, LanguageOption } from '../i18n/languages';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check, Sparkles } from 'lucide-react';

interface LanguageOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageOnboardingModal: React.FC<LanguageOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentLanguage, setLanguage } = useLanguage();

  if (!isOpen) return null;

  const handleSelect = (code: string) => {
    setLanguage(code);
    localStorage.setItem('opriva_onboarding_language_selected', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-slate-900 to-teal-950 text-white text-center relative">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mb-3">
            <Globe className="w-6 h-6 text-teal-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Select Your Preferred Language
          </h2>
          <p className="text-teal-200/80 text-xs sm:text-sm mt-1">
            దయచేసి మీ భాషను ఎంచుకోండి • कृपया अपनी भाषा चुनें • உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்
          </p>
        </div>

        {/* 12 Indian Languages Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SUPPORTED_LANGUAGES.map((lang: LanguageOption) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between relative group ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/70 shadow-sm ring-2 ring-teal-500'
                      : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-semibold text-slate-500">
                      {lang.name}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <span className="text-base font-bold text-slate-900 mt-2 block">
                    {lang.nativeName}
                  </span>
                  {lang.isRtl && (
                    <span className="text-[10px] text-teal-700 font-semibold mt-1 block">
                      Right-to-Left (RTL)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            You can also change this anytime from the top bar.
          </span>
          <button
            onClick={() => {
              localStorage.setItem('opriva_onboarding_language_selected', 'true');
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm"
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
};
