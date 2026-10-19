import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { 
  Building2, 
  Users, 
  Stethoscope, 
  Globe, 
  LogOut, 
  Bell, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'patient' | 'receptionist' | 'clinical';
  setActiveTab: (tab: 'patient' | 'receptionist' | 'clinical') => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unreadNotificationsCount = 0,
  onOpenNotifications,
}) => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { user, logout, switchDemoRole } = useAuth();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Opriva Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('patient')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-50 to-white p-1 border border-teal-100 shadow-sm flex items-center justify-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Opriva Symbol" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                Opriva
                <span className="inline-block w-2 h-2 rounded-full bg-teal-500"></span>
              </span>
              <span className="text-xs font-medium text-teal-700 tracking-wide">
                Healthcare, Without the Wait.
              </span>
            </div>
          </div>

          {/* Role Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                setActiveTab('patient');
                if (user?.role !== 'ROLE_PATIENT') switchDemoRole('ROLE_PATIENT');
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'patient'
                  ? 'bg-white text-teal-800 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>Patient Portal</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('receptionist');
                if (user?.role !== 'ROLE_RECEPTIONIST') switchDemoRole('ROLE_RECEPTIONIST');
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'receptionist'
                  ? 'bg-white text-teal-800 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-sky-600" />
              <span>OP Receptionist</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('clinical');
                if (user?.role !== 'ROLE_CLINICIAN') switchDemoRole('ROLE_CLINICIAN');
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'clinical'
                  ? 'bg-white text-teal-800 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-indigo-600" />
              <span>Clinical Interface</span>
            </button>
          </nav>

          {/* Right Controls: Language Selector, Notifications, User */}
          <div className="flex items-center space-x-3">
            
            {/* 12 Indian Languages Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition shadow-2xs focus:ring-2 focus:ring-teal-500"
              >
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.nativeName}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangDropdownOpen && (
                <>
                  {/* Backdrop to prevent disappearing and close on click outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsLangDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 max-h-80 overflow-y-auto">
                    <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Select Indian Language
                    </div>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-teal-50 transition ${
                          currentLanguage === lang.code ? 'text-teal-700 font-bold bg-teal-50/70' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{lang.nativeName}</span>
                          <span className="text-[10px] text-slate-400">{lang.name}</span>
                        </div>
                        {currentLanguage === lang.code && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Profile / Switch Info */}
            <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.fullName || 'Guest Patient'}
                </span>
                <span className="text-[10px] font-medium text-slate-500">
                  {user?.role === 'ROLE_RECEPTIONIST' ? 'OP Receptionist' :
                   user?.role === 'ROLE_CLINICIAN' ? 'Authorized Clinician' : 'Patient'}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
