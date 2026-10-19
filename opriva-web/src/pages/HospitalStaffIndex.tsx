import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Stethoscope, 
  Users, 
  Tv, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  HelpCircle,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';

interface HospitalStaffIndexProps {
  onSelectStation: (station: 'receptionist' | 'clinical' | 'tv-display') => void;
}

export const HospitalStaffIndex: React.FC<HospitalStaffIndexProps> = ({ onSelectStation }) => {
  const { login, switchDemoRole } = useAuth();
  
  const [activeRole, setActiveRole] = useState<'receptionist' | 'clinical' | 'tv'>('receptionist');
  const [selectedHospital, setSelectedHospital] = useState('Apollo Health City, Jubilee Hills');
  const [selectedDesk, setSelectedDesk] = useState('Counter 1 • General OP Registration');
  const [selectedDoctorRoom, setSelectedDoctorRoom] = useState('Room 102 • Dr. Rajesh Sharma (General Medicine)');
  
  const [emailInput, setEmailInput] = useState('receptionist@apollo.opriva.com');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSwitch = (role: 'receptionist' | 'clinical' | 'tv') => {
    setActiveRole(role);
    setErrorMsg(null);
    if (role === 'receptionist') {
      setEmailInput('receptionist@apollo.opriva.com');
      setPasswordInput('password123');
    } else if (role === 'clinical') {
      setEmailInput('dr.sharma@apollo.opriva.com');
      setPasswordInput('password123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      if (activeRole === 'receptionist') {
        await login(emailInput, passwordInput);
        onSelectStation('receptionist');
      } else if (activeRole === 'clinical') {
        await login(emailInput, passwordInput);
        onSelectStation('clinical');
      }
    } catch (err: any) {
      setErrorMsg('Invalid staff ID or password. Please verify your hospital credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstantDemoLogin = async (role: 'receptionist' | 'clinical') => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      if (role === 'receptionist') {
        await switchDemoRole('ROLE_RECEPTIONIST');
        onSelectStation('receptionist');
      } else {
        await switchDemoRole('ROLE_CLINICIAN');
        onSelectStation('clinical');
      }
    } catch (err: any) {
      setErrorMsg('Quick login failed. Please use manual sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/70 via-slate-50 to-slate-100 text-slate-800 flex flex-col justify-between selection:bg-teal-500 selection:text-white font-sans">
      
      {/* Hospital Top Navigation Header */}
      <header className="bg-white border-b border-slate-200 shadow-xs px-6 sm:px-12 py-3.5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Hospital Logo & Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-50 to-white p-1 border border-teal-200 shadow-xs flex items-center justify-center">
              <img src="/logo.png" alt="Opriva" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">Opriva</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold uppercase tracking-wider">
                  Hospital Staff Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Outpatient Department (OPD) Workstation</p>
            </div>
          </div>

          {/* Hospital Branch & Staff IT Helpdesk Info */}
          <div className="hidden sm:flex items-center space-x-5 text-xs text-slate-600">
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span className="font-semibold text-slate-800">Apollo Health City • Jubilee Hills</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-500">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>IT Support: <strong>ext. 4401</strong></span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Login Screen */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex flex-col items-center justify-center">
        
        {/* Clean Hospital Heading */}
        <div className="text-center mb-8 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Authorized Hospital Personnel Only
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Staff Workstation Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Select your shift duty to access patient registration, clinical consultations, or waiting lounge display.
          </p>
        </div>

        {/* Central Hospital Login Card */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200 overflow-hidden">
          
          {/* Hospital Duty Role Selector (3 Roles: Receptionist, Doctor, Waiting TV) */}
          <div className="grid grid-cols-3 p-1.5 bg-slate-100/90 border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleRoleSwitch('receptionist')}
              className={`py-3 px-2 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                activeRole === 'receptionist'
                  ? 'bg-white text-teal-800 shadow-sm border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className={`w-4 h-4 ${activeRole === 'receptionist' ? 'text-teal-600' : 'text-slate-400'}`} />
              <span>Reception Desk</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('clinical')}
              className={`py-3 px-2 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                activeRole === 'clinical'
                  ? 'bg-white text-indigo-800 shadow-sm border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className={`w-4 h-4 ${activeRole === 'clinical' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Doctor OPD</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('tv')}
              className={`py-3 px-2 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                activeRole === 'tv'
                  ? 'bg-white text-sky-800 shadow-sm border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tv className={`w-4 h-4 ${activeRole === 'tv' ? 'text-sky-600' : 'text-slate-400'}`} />
              <span>Waiting TV</span>
            </button>
          </div>

          <div className="p-7">
            
            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="font-bold">Error:</span> {errorMsg}
              </div>
            )}

            {/* TAB 1: RECEPTIONIST DESK LOGIN */}
            {activeRole === 'receptionist' && (
              <form onSubmit={handleLogin} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hospital Branch
                  </label>
                  <select
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  >
                    <option value="Apollo Health City, Jubilee Hills">Apollo Health City • Jubilee Hills, Hyderabad</option>
                    <option value="AIIMS Outpatient Center, New Delhi">AIIMS Outpatient Center • Ansari Nagar, New Delhi</option>
                    <option value="Manipal Hospital, Bengaluru">Manipal Hospital • Old Airport Road, Bengaluru</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Counter Assignment
                  </label>
                  <select
                    value={selectedDesk}
                    onChange={(e) => setSelectedDesk(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  >
                    <option value="Counter 1 • General OP Registration">Counter 1 • General OP Registration Desk</option>
                    <option value="Counter 2 • Special Priority OP">Counter 2 • Special Priority OP & Senior Care</option>
                    <option value="Counter 3 • Cash & Billing Counter">Counter 3 • Cash & Billing Counter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Receptionist Staff Email / Employee ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="receptionist@apollo.opriva.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to OP Reception Desk'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('receptionist')}
                    className="w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Instant 1-Click Receptionist Login</span>
                  </button>
                </div>

              </form>
            )}

            {/* TAB 2: DOCTOR CLINICAL CHAMBER LOGIN */}
            {activeRole === 'clinical' && (
              <form onSubmit={handleLogin} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hospital Branch
                  </label>
                  <select
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  >
                    <option value="Apollo Health City, Jubilee Hills">Apollo Health City • Jubilee Hills, Hyderabad</option>
                    <option value="AIIMS Outpatient Center, New Delhi">AIIMS Outpatient Center • Ansari Nagar, New Delhi</option>
                    <option value="Manipal Hospital, Bengaluru">Manipal Hospital • Old Airport Road, Bengaluru</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Consulting Room & Department
                  </label>
                  <select
                    value={selectedDoctorRoom}
                    onChange={(e) => setSelectedDoctorRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  >
                    <option value="Room 102 • Dr. Rajesh Sharma (General Medicine)">Room 102 • Dr. Rajesh Sharma (General Medicine)</option>
                    <option value="Room 104 • Dr. Priya Nair (Pediatrics)">Room 104 • Dr. Priya Nair (Pediatrics)</option>
                    <option value="Room 106 • Dr. Arvind Rao (Cardiology)">Room 106 • Dr. Arvind Rao (Cardiology)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Doctor Registered Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="dr.sharma@apollo.opriva.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Doctor Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Verifying Clinician ID...' : 'Enter Clinical OPD Chamber'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('clinical')}
                    className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Instant 1-Click Doctor Login</span>
                  </button>
                </div>

              </form>
            )}

            {/* TAB 3: WAITING HALL TV DISPLAY LAUNCHER */}
            {activeRole === 'tv' && (
              <div className="text-center py-2 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto border border-sky-200">
                  <Tv className="w-7 h-7" />
                </div>
                
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Waiting Hall TV Live Monitor</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Full-screen queue display for the main patient lounge with automatic token calling chime and voice announcements.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-medium">Lounge Location:</span>
                    <span className="font-bold text-slate-800">Main Outpatient Waiting Hall</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-medium">Voice Announcement:</span>
                    <span className="font-bold text-teal-700">English, Hindi & Telugu</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-medium">Display Mode:</span>
                    <span className="font-bold text-slate-800">Full Screen High-Contrast</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectStation('tv-display')}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition flex items-center justify-center space-x-2"
                >
                  <span>Launch Full-Screen TV Board</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

          {/* Card Footer Security Assurance */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hospital Intranet Secure Session • HIPAA & ABDM Compliant</span>
          </div>

        </div>

      </main>

      {/* Hospital Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 sm:px-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">Opriva Hospital Enterprise System</span>
            <span>•</span>
            <span>Apollo Health City Network</span>
          </div>
          <div>
            Need access credentials? Contact Hospital Medical Records Department (MRD)
          </div>
        </div>
      </footer>

    </div>
  );
};
