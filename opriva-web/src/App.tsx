import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PatientPortal } from './pages/patient/PatientPortal';
import { ReceptionistDashboard } from './pages/receptionist/ReceptionistDashboard';
import { ClinicalDashboard } from './pages/clinical/ClinicalDashboard';
import { WaitingHallTvDisplay } from './pages/WaitingHallTvDisplay';
import { HospitalStaffIndex } from './pages/HospitalStaffIndex';
import { LanguageOnboardingModal } from './components/LanguageOnboardingModal';
import { useAuth } from './context/AuthContext';
import { recordsApi } from './services/api';
import { Bell, X, Check, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'index' | 'receptionist' | 'clinical' | 'tv-display'>('index');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(() => {
    return !localStorage.getItem('opriva_onboarding_language_selected');
  });

  // Sync tab with user's role on role login
  useEffect(() => {
    if (user?.role === 'ROLE_RECEPTIONIST') {
      setActiveTab('receptionist');
    } else if (user?.role === 'ROLE_CLINICIAN') {
      setActiveTab('clinical');
    }
  }, [user?.role]);

  // Load notifications
  const loadNotifications = async () => {
    try {
      const data = await recordsApi.getNotifications();
      setNotifications(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id: string) => {
    try {
      await recordsApi.markNotificationRead(id);
      loadNotifications();
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab('index');
  };

  // 1. HOSPITAL GATEWAY INDEX
  if (activeTab === 'index' || (!user && activeTab !== 'tv-display')) {
    return (
      <HospitalStaffIndex 
        onSelectStation={(station) => {
          setActiveTab(station);
        }} 
      />
    );
  }

  // 2. WAITING HALL LIVE TV DISPLAY (Full Screen)
  if (activeTab === 'tv-display') {
    return (
      <WaitingHallTvDisplay 
        onBackToPortal={() => setActiveTab('index')} 
      />
    );
  }

  // 3. LOGGED IN HOSPITAL WORKSTATIONS (Receptionist Desk or Doctor OPD Chamber)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Opriva Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onReturnToIndex={() => setActiveTab('index')}
      />

      {/* Main Workstation View Area */}
      <main className="flex-1">
        {activeTab === 'receptionist' && <ReceptionistDashboard />}
        {activeTab === 'clinical' && <ClinicalDashboard />}
      </main>

      {/* Language Onboarding Selector */}
      <LanguageOnboardingModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />

      {/* Notifications Slide-over Drawer */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-2xs">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-slideLeft">
            
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsNotifOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No notifications yet.
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border text-xs transition ${
                      n.read
                        ? 'bg-white border-slate-200 text-slate-600'
                        : 'bg-teal-50/60 border-teal-200 text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-slate-800">{n.title}</h4>
                      {!n.read && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          className="text-[10px] text-teal-700 hover:underline flex items-center gap-0.5"
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3" />
                          <span>Read</span>
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-slate-600 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      {new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* Brand Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Opriva" className="w-5 h-5 object-contain" />
            <span className="font-extrabold text-slate-800">Opriva Enterprise Hospital Suite</span>
            <span>— Healthcare, Without the Wait.</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <button 
              onClick={() => setActiveTab('index')} 
              className="text-teal-700 hover:underline font-semibold"
            >
              Switch Workstation
            </button>
            <span>•</span>
            <span>Powered by Neon PostgreSQL</span>
            <span>•</span>
            <button 
              onClick={handleLogout} 
              className="text-rose-600 hover:underline font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
