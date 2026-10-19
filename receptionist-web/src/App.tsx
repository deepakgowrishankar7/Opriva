import React, { useState } from 'react';
import { ReceptionistDashboard } from './pages/receptionist/ReceptionistDashboard';
import { WaitingHallTvDisplay } from './pages/WaitingHallTvDisplay';
import { useAuth } from './context/AuthContext';
import { 
  Building2, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Tv, 
  LayoutDashboard, 
  KeyRound, 
  Lock, 
  Mail, 
  Hospital, 
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle
} from 'lucide-react';

export const App: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [emailInput, setEmailInput] = useState('receptionist@apollo.opriva.com');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [selectedHospital, setSelectedHospital] = useState('Apollo Health City (Jubilee Hills)');
  const [counterRoom, setCounterRoom] = useState('Counter 1 • General OP Desk');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeView, setActiveView] = useState<'desk' | 'tv-display'>('desk');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(emailInput, passwordInput);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid receptionist credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modern High-Trust Hospital Staff Receptionist Landing & Login
  if (!user || user.role !== 'ROLE_RECEPTIONIST') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 flex flex-col justify-between text-slate-100 select-none">
        
        {/* Top Header Banner */}
        <header className="px-6 sm:px-12 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-xl flex items-center justify-center">
              <img src="/logo.png" alt="Opriva" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-white">Opriva</span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-[11px] font-extrabold uppercase">
                  RECEPTION PORTAL
                </span>
              </div>
              <span className="text-xs text-teal-300 font-medium">Healthcare, Without the Wait.</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>TLS 256-Bit Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Real-Time Cloud Queue</span>
            </div>
          </div>
        </header>

        {/* Hero & Login Form Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
          
          {/* Left Column: Visual Briefing & Capabilities */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Hospital OP Reception &amp; Token Station</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Manage Outpatient Queues with Zero Waiting Chaos.
            </h1>

            <p className="text-slate-300 text-base leading-relaxed max-w-xl">
              Authenticate your counter workstation to issue daily tokens, register walk-in patients, verify online QR payments, and call next patients to doctor consultation rooms.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-2xl font-black text-teal-400 font-mono block">100%</span>
                <span className="text-xs font-semibold text-slate-300 block mt-1">Verified Payments</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Automated UPI reconciliation</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-2xl font-black text-indigo-400 font-mono block">&lt; 10s</span>
                <span className="text-xs font-semibold text-slate-300 block mt-1">Walk-in Token Time</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Rapid counter issue slip</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-2xl font-black text-emerald-400 font-mono block">Live TV</span>
                <span className="text-xs font-semibold text-slate-300 block mt-1">Waiting Hall Display</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Chime audio announcements</span>
              </div>
            </div>
          </div>

          {/* Right Column: Professional Counter Login Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 text-slate-800 relative">
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Staff Sign In</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Access hospital OP counter console</p>
                </div>
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-700">
                  <KeyRound className="w-5 h-5" />
                </div>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                
                {/* Hospital Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Assigned Hospital Facility
                  </label>
                  <div className="relative">
                    <Hospital className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <select
                      value={selectedHospital}
                      onChange={(e) => setSelectedHospital(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-500 outline-hidden bg-slate-50"
                    >
                      <option value="Apollo Health City (Jubilee Hills)">Apollo Health City (Jubilee Hills)</option>
                      <option value="KIMS Hospitals (Secunderabad)">KIMS Hospitals (Secunderabad)</option>
                      <option value="Manipal Hospital (Bengaluru)">Manipal Hospital (Bengaluru)</option>
                      <option value="Government General Hospital (Hyderabad)">Government General Hospital (Hyderabad)</option>
                    </select>
                  </div>
                </div>

                {/* Counter Station */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Workstation / Counter
                  </label>
                  <select
                    value={counterRoom}
                    onChange={(e) => setCounterRoom(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-500 outline-hidden bg-slate-50"
                  >
                    <option value="Counter 1 • General OP Desk">Counter 1 • General OP Desk</option>
                    <option value="Counter 2 • Special Priority OP Desk">Counter 2 • Special Priority OP Desk</option>
                    <option value="Counter 3 • Senior Citizen & Subsidized">Counter 3 • Senior Citizen &amp; Subsidized</option>
                  </select>
                </div>

                {/* Staff Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Staff Email / Operator ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <span>Authenticating Workstation...</span>
                  ) : (
                    <>
                      <span>Open Reception Desk Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Pre-Seeded Demo Pill */}
              <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block">
                  Demo Staff Account: <strong className="text-slate-800">receptionist@apollo.opriva.com</strong> / <strong className="text-slate-800">password123</strong>
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Global Footer */}
        <footer className="px-6 py-4 border-t border-white/10 text-center text-xs text-slate-400">
          Opriva Health Platform • Multi-Hospital Outpatient Registration &amp; Real-Time Queue System
        </footer>

      </div>
    );
  }

  // Authenticated Receptionist Layout
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Dedicated Reception Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Opriva" className="w-8 h-8 object-contain" />
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                Opriva
                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-bold border border-teal-200">
                  RECEPTION DESK
                </span>
              </span>
              <span className="text-[11px] text-slate-500 block">
                {selectedHospital} • {counterRoom}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveView('desk')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeView === 'desk'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
                <span>Counter Desk</span>
              </button>

              <button
                onClick={() => setActiveView('tv-display')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeView === 'tv-display'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tv className="w-3.5 h-3.5 text-indigo-600" />
                <span>Waiting Hall TV Display</span>
              </button>
            </div>

            <div className="text-right pl-2 border-l border-slate-200">
              <span className="text-xs font-bold text-slate-800 block">
                {user.fullName}
              </span>
              <span className="text-[10px] text-slate-500">
                Staff ID: {user.userId}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Receptionist Workspace or Fullscreen TV Monitor */}
      {activeView === 'desk' ? (
        <>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ReceptionistDashboard />
          </main>
          <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
            Opriva Reception Desk • Strictly Authorized Hospital Operation Only
          </footer>
        </>
      ) : (
        <div className="flex-1">
          <WaitingHallTvDisplay />
        </div>
      )}
    </div>
  );
};
