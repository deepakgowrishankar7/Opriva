import React, { useState } from 'react';
import { ClinicalDashboard } from './pages/clinical/ClinicalDashboard';
import { useAuth } from './context/AuthContext';
import { 
  Stethoscope, 
  LogOut, 
  ShieldCheck, 
  FileCheck, 
  Sparkles, 
  Lock, 
  Mail, 
  Building2, 
  ArrowRight,
  KeyRound,
  FileText,
  UserCheck
} from 'lucide-react';

export const App: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [emailInput, setEmailInput] = useState('dr.sharma@apollo.opriva.com');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [department, setDepartment] = useState('General Medicine & Diagnostics');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(emailInput, passwordInput);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid clinician credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modern Clinical Doctor Landing & Login
  if (!user || user.role !== 'ROLE_CLINICIAN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-between text-slate-100 select-none">
        
        {/* Top Header Banner */}
        <header className="px-6 sm:px-12 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-xl flex items-center justify-center">
              <img src="/logo.png" alt="Opriva" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-white">Opriva</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-400/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-extrabold uppercase">
                  CLINICAL PORTAL
                </span>
              </div>
              <span className="text-xs text-indigo-300 font-medium">Healthcare, Without the Wait.</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>SHA-256 Digital Signatures</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span>Consent-Governed Records</span>
            </div>
          </div>
        </header>

        {/* Hero & Clinical Login Form */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
          
          {/* Left Column: Doctor Briefing */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <Stethoscope className="w-4 h-4" />
              <span>Verified Medical Practitioner Workspace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Review Patient History &amp; Issue Signed Prescriptions in Seconds.
            </h1>

            <p className="text-slate-300 text-base leading-relaxed max-w-xl">
              Access authorized diagnostic reports, preview previous visit records with patient consent, and generate tamper-proof digital prescriptions backed by immutable cryptographic signatures.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-2xl font-black text-indigo-400 font-mono block">SHA-256</span>
                <span className="text-xs font-semibold text-slate-300 block mt-1">Digital Signatures</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Tamper-evident verification</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-2xl font-black text-teal-400 font-mono block">Instant</span>
                <span className="text-xs font-semibold text-slate-300 block mt-1">Diagnostic Viewer</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">High-res lab &amp; scan PDFs</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-2xl font-black text-purple-400 font-mono block">Private</span>
                <span className="text-xs font-semibold text-slate-300 block mt-1">Consent Governed</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Strict patient privacy checks</span>
              </div>
            </div>
          </div>

          {/* Right Column: Doctor Login Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 text-slate-800 relative">
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Clinician Sign In</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Access medical records &amp; prescription console</p>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700">
                  <Stethoscope className="w-5 h-5" />
                </div>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                
                {/* Department Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Clinical Department / Specialization
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden bg-slate-50"
                  >
                    <option value="General Medicine & Diagnostics">General Medicine &amp; Diagnostics</option>
                    <option value="Cardiology & Vascular OP">Cardiology &amp; Vascular OP</option>
                    <option value="Orthopaedics & Sports Injury">Orthopaedics &amp; Sports Injury</option>
                    <option value="Paediatrics & Child Health">Paediatrics &amp; Child Health</option>
                  </select>
                </div>

                {/* Doctor Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Doctor Email / Medical Registration No
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
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
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <span>Verifying Clinical Credentials...</span>
                  ) : (
                    <>
                      <span>Enter Doctor Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Pre-Seeded Demo Pill */}
              <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block">
                  Demo Doctor Account: <strong className="text-slate-800">dr.sharma@apollo.opriva.com</strong> / <strong className="text-slate-800">password123</strong>
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Global Footer */}
        <footer className="px-6 py-4 border-t border-white/10 text-center text-xs text-slate-400">
          Opriva Doctor Portal • Cryptographically Signed Prescriptions &amp; Patient-Authorized Clinical Records
        </footer>

      </div>
    );
  }

  // Authenticated Doctor Layout
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Dedicated Doctor Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Opriva" className="w-8 h-8 object-contain" />
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                Opriva
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                  DOCTOR WORKSPACE
                </span>
              </span>
              <span className="text-[11px] text-slate-500 block">
                Hospital: Apollo Health City (Jubilee Hills) • {department}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-800 block">
                {user.fullName}
              </span>
              <span className="text-[10px] text-slate-500">
                Consultant Physician
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

      {/* Main Clinical Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ClinicalDashboard />
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        Opriva Doctor Portal • Cryptographically Signed Prescriptions &amp; Patient-Authorized Records
      </footer>
    </div>
  );
};
