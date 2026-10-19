import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Stethoscope, 
  Users, 
  Tv, 
  ShieldCheck, 
  Sparkles, 
  KeyRound, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  MessageSquare, 
  QrCode, 
  Smartphone,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';

interface HospitalStaffIndexProps {
  onSelectStation: (station: 'receptionist' | 'clinical' | 'tv-display' | 'patient') => void;
}

export const HospitalStaffIndex: React.FC<HospitalStaffIndexProps> = ({ onSelectStation }) => {
  const { login, switchDemoRole } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'receptionist' | 'clinical' | 'tv' | 'patient'>('receptionist');
  const [selectedHospital, setSelectedHospital] = useState('Apollo Health City (Jubilee Hills)');
  const [selectedCounter, setSelectedCounter] = useState('Counter 1 • General OP Desk');
  const [selectedDoctorRoom, setSelectedDoctorRoom] = useState('Room 102 • Dr. Rajesh Sharma (General Medicine)');
  
  const [emailInput, setEmailInput] = useState('receptionist@apollo.opriva.com');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Sync default email when switching tabs
  const handleTabChange = (tab: 'receptionist' | 'clinical' | 'tv' | 'patient') => {
    setActiveTab(tab);
    setErrorMsg(null);
    if (tab === 'receptionist') {
      setEmailInput('receptionist@apollo.opriva.com');
      setPasswordInput('password123');
    } else if (tab === 'clinical') {
      setEmailInput('dr.sharma@apollo.opriva.com');
      setPasswordInput('password123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      if (activeTab === 'receptionist') {
        await login(emailInput, passwordInput);
        onSelectStation('receptionist');
      } else if (activeTab === 'clinical') {
        await login(emailInput, passwordInput);
        onSelectStation('clinical');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your staff email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLaunch = async (station: 'receptionist' | 'clinical') => {
    setIsSubmitting(true);
    try {
      if (station === 'receptionist') {
        await switchDemoRole('ROLE_RECEPTIONIST');
        onSelectStation('receptionist');
      } else {
        await switchDemoRole('ROLE_CLINICIAN');
        onSelectStation('clinical');
      }
    } catch (err: any) {
      setErrorMsg('Quick launch failed. Please use form login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      
      {/* Top Header Banner */}
      <header className="px-6 sm:px-12 py-5 flex items-center justify-between border-b border-white/10 backdrop-blur-md sticky top-0 z-40 bg-slate-950/80">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-xl flex items-center justify-center">
            <img src="/logo.png" alt="Opriva" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl font-black tracking-tight text-white">Opriva</span>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-[11px] font-extrabold uppercase tracking-wider">
                HOSPITAL ENTERPRISE SUITE
              </span>
            </div>
            <span className="text-xs text-teal-300/80 font-medium">Healthcare, Without the Wait.</span>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="hidden sm:flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-emerald-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">Neon Cloud DB: Active</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-teal-500/30 text-teal-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span className="font-semibold">Live STOMP Sync: Ready</span>
          </div>
        </div>
      </header>

      {/* Main Hero & Station Gateway */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full flex-1 flex flex-col justify-center">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Unified Hospital Workstation Portal
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Select Your Hospital Workstation
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            Authorized hospital personnel can access their OP registration desk, clinical doctor chamber, or launch waiting hall TV displays.
          </p>
        </div>

        {/* Station Navigation Cards / Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto w-full mb-8">
          
          <button
            onClick={() => handleTabChange('receptionist')}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              activeTab === 'receptionist'
                ? 'bg-teal-500/20 border-teal-400 text-white shadow-lg shadow-teal-500/20 scale-[1.02]'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300 mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">Receptionist Desk</span>
              <span className="text-[11px] opacity-70">Walk-ins & Token Issuance</span>
            </div>
          </button>

          <button
            onClick={() => handleTabChange('clinical')}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              activeTab === 'clinical'
                ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 mb-3">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">Doctor Chamber</span>
              <span className="text-[11px] opacity-70">OPD Queue & Rx Builder</span>
            </div>
          </button>

          <button
            onClick={() => handleTabChange('tv')}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              activeTab === 'tv'
                ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/20 scale-[1.02]'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-300 mb-3">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">Waiting Hall TV</span>
              <span className="text-[11px] opacity-70">Audio Chime & Big Display</span>
            </div>
          </button>

          <button
            onClick={() => handleTabChange('patient')}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              activeTab === 'patient'
                ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 mb-3">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">Patient Web Portal</span>
              <span className="text-[11px] opacity-70">Online OP Booking</span>
            </div>
          </button>

        </div>

        {/* Selected Station Card */}
        <div className="max-w-xl mx-auto w-full">
          
          {/* RECEPTIONIST LOGIN FORM */}
          {activeTab === 'receptionist' && (
            <div className="bg-slate-900/90 border border-teal-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-fadeIn">
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-400" />
                    OP Reception Desk Login
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage walk-in registrations, print thermal receipts & issue tokens
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
                  ROLE_RECEPTIONIST
                </span>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Hospital Branch
                  </label>
                  <select
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Apollo Health City (Jubilee Hills)">Apollo Health City (Jubilee Hills, Hyderabad)</option>
                    <option value="AIIMS Outpatient Wing">AIIMS Outpatient Center (Ansari Nagar, New Delhi)</option>
                    <option value="Manipal Hospital">Manipal Hospital (Old Airport Road, Bengaluru)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Counter Assignment
                  </label>
                  <select
                    value={selectedCounter}
                    onChange={(e) => setSelectedCounter(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Counter 1 • General OP Desk">Counter 1 • General OP Registration Desk</option>
                    <option value="Counter 2 • Special Priority OP">Counter 2 • Special Priority OP & Senior Care</option>
                    <option value="Counter 3 • Cash & Billing Counter">Counter 3 • Cash & Billing Counter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Staff Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In to OP Reception Desk'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLaunch('receptionist')}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-teal-300 border border-teal-500/30 text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>Instant 1-Click Receptionist Demo Login</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* DOCTOR CLINICAL LOGIN FORM */}
          {activeTab === 'clinical' && (
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-fadeIn">
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-indigo-400" />
                    Clinical Doctor Portal Login
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Call OPD patients, create digital prescriptions & review reports
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                  ROLE_CLINICIAN
                </span>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Department & Chamber
                  </label>
                  <select
                    value={selectedDoctorRoom}
                    onChange={(e) => setSelectedDoctorRoom(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Room 102 • Dr. Rajesh Sharma (General Medicine)">Room 102 • Dr. Rajesh Sharma (General Medicine)</option>
                    <option value="Room 104 • Dr. Priya Nair (Pediatrics)">Room 104 • Dr. Priya Nair (Pediatrics)</option>
                    <option value="Room 106 • Dr. Arvind Rao (Cardiology)">Room 106 • Dr. Arvind Rao (Cardiology)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Doctor Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-sm transition shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Authenticating...' : 'Enter Clinical OPD Chamber'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLaunch('clinical')}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Instant 1-Click Doctor Demo Login</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* WAITING HALL TV DISPLAY LAUNCHER */}
          {activeTab === 'tv' && (
            <div className="bg-slate-900/90 border border-sky-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-fadeIn text-center">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-4">
                <Tv className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white">Waiting Hall Public TV Display</h2>
              <p className="text-slate-400 text-xs mt-2 max-w-md mx-auto">
                Full-screen queue monitor for patient lounge TVs. Features live token call announcements in English, Hindi, and Telugu, audio chimes, and automatic WebSocket sync.
              </p>

              <div className="my-6 p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-left text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold">Target Screen:</span>
                  <span className="text-sky-300 font-mono">OPD Main Waiting Lounge (1080p/4K)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold">Audio Engine:</span>
                  <span className="text-emerald-400 font-mono">Web Audio Oscillator + Speech Synthesis</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold">Sync Mode:</span>
                  <span className="text-teal-300 font-mono">Real-time STOMP WebSocket</span>
                </div>
              </div>

              <button
                onClick={() => onSelectStation('tv-display')}
                className="w-full py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm transition shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2"
              >
                <span>Launch Full Screen TV Display</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* PATIENT WEB PORTAL LAUNCHER */}
          {activeTab === 'patient' && (
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-fadeIn text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white">Patient Web Booking Portal</h2>
              <p className="text-slate-400 text-xs mt-2 max-w-md mx-auto">
                Explore verified hospitals nearby, select Normal or Special Priority OP cards, pay seamlessly via UPI QR, and track live queue status.
              </p>

              <div className="my-6 p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-left text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold">Features:</span>
                  <span className="text-emerald-300">Card selection, Slot Booking, Receipts</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold">Languages:</span>
                  <span className="text-teal-300">12 Indian Languages Supported</span>
                </div>
              </div>

              <button
                onClick={() => {
                  switchDemoRole('ROLE_PATIENT');
                  onSelectStation('patient');
                }}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2"
              >
                <span>Open Patient Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* VISUAL EXPLAINER: HOW WHATSAPP FLOW WORKS */}
        <div className="mt-14 max-w-5xl mx-auto w-full">
          <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <MessageSquare className="w-4 h-4" />
                  Opriva Zero-Install WhatsApp Booking Flow
                </div>
                <h3 className="text-xl font-black text-white">
                  How Patients Book via WhatsApp (No App Download Required)
                </h3>
              </div>
              <button
                onClick={() => setShowWhatsAppModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto"
              >
                <QrCode className="w-4 h-4" />
                <span>Simulate WhatsApp Bot</span>
              </button>
            </div>

            {/* 5-Step Visual Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-6">
              
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center mb-3">
                    01
                  </div>
                  <h4 className="font-bold text-sm text-white">Scan & Send "Hi"</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Patient scans the hospital standee QR or sends "Hi" to Opriva WhatsApp business number.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono mt-3">wa.me/919000012345</span>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 text-xs font-bold flex items-center justify-center mb-3">
                    02
                  </div>
                  <h4 className="font-bold text-sm text-white">Pick OP Card Type</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Bot replies with interactive buttons: 1️⃣ Normal OP (₹350) or 2️⃣ Special Priority OP (₹750).
                  </p>
                </div>
                <span className="text-[10px] text-teal-400 font-mono mt-3">Interactive WhatsApp list</span>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 text-xs font-bold flex items-center justify-center mb-3">
                    03
                  </div>
                  <h4 className="font-bold text-sm text-white">Instant UPI Link</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Bot sends instant UPI payment link. Patient pays via GPay, PhonePe, or WhatsApp Pay.
                  </p>
                </div>
                <span className="text-[10px] text-sky-400 font-mono mt-3">Zero waiting at cashier</span>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center mb-3">
                    04
                  </div>
                  <h4 className="font-bold text-sm text-white">Digital OP Card Slip</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Bot delivers verified digital OP card with QR code, token number (e.g. S-201), and room number.
                  </p>
                </div>
                <span className="text-[10px] text-indigo-400 font-mono mt-3">PDF + In-chat ticket</span>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold flex items-center justify-center mb-3">
                    05
                  </div>
                  <h4 className="font-bold text-sm text-white">Live Turn Alert</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Automated alert ping when 2 patients remain: "Your turn in 10 mins! Please report to Room 102."
                  </p>
                </div>
                <span className="text-[10px] text-purple-400 font-mono mt-3">No crowded waiting halls</span>
              </div>

            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-6 sm:px-12 py-5 border-t border-white/10 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span>Opriva Unified Healthcare Platform</span>
          <span>•</span>
          <span>Powered by Neon PostgreSQL Cloud</span>
        </div>
        <div className="text-slate-400">
          Staff Support Line: <strong>+91-40-2360-7777</strong> (Toll Free)
        </div>
      </footer>

      {/* WHATSAPP FLOW SIMULATION MODAL */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111b21] border border-white/10 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl animate-fadeIn">
            
            {/* WhatsApp Chat Header */}
            <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between text-white border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center font-bold text-sm">
                  OP
                </div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    Opriva Hospital Desk
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                  </div>
                  <span className="text-[11px] text-emerald-400">Official Healthcare Account</span>
                </div>
              </div>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 bg-[#0b141a] text-xs h-96 overflow-y-auto">
              
              {/* User: Hi */}
              <div className="flex justify-end">
                <div className="bg-[#005c4b] text-white p-2.5 rounded-2xl rounded-tr-none max-w-[80%]">
                  Hi, I want to book an OP ticket at Apollo Health City
                  <span className="text-[9px] text-white/50 block text-right mt-1">10:14 AM ✓✓</span>
                </div>
              </div>

              {/* Bot: Menu */}
              <div className="flex justify-start">
                <div className="bg-[#202c33] text-white p-3 rounded-2xl rounded-tl-none max-w-[85%] space-y-2">
                  <p className="font-semibold text-teal-300">Namaste! Welcome to Apollo Health City OP Desk 🙏</p>
                  <p className="text-slate-300 text-[11px]">Please select your Outpatient Registration type:</p>
                  
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">1. Normal OP Card</div>
                        <div className="text-[10px] text-slate-400">Standard general queue</div>
                      </div>
                      <span className="font-bold text-emerald-400">₹350</span>
                    </div>

                    <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-teal-300">2. Special Priority OP ⭐</div>
                        <div className="text-[10px] text-teal-400/80">Priority Queue Bypass</div>
                      </div>
                      <span className="font-bold text-teal-300">₹750</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-white/50 block text-right">10:14 AM</span>
                </div>
              </div>

              {/* User Selection */}
              <div className="flex justify-end">
                <div className="bg-[#005c4b] text-white p-2.5 rounded-2xl rounded-tr-none max-w-[80%]">
                  Selected: 2. Special Priority OP (₹750)
                  <span className="text-[9px] text-white/50 block text-right mt-1">10:15 AM ✓✓</span>
                </div>
              </div>

              {/* Bot Ticket Confirmation */}
              <div className="flex justify-start">
                <div className="bg-[#202c33] text-white p-3 rounded-2xl rounded-tl-none max-w-[85%] space-y-2 border border-emerald-500/30">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Payment Confirmed (UPI Ref: OP-99124)
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">YOUR OP TOKEN</div>
                    <div className="text-2xl font-black text-teal-300 font-mono">S-201</div>
                    <div className="text-[11px] text-slate-300 mt-1">Room 102 • Dr. Rajesh Sharma</div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Live Queue Tracker: <span className="text-teal-400 underline">https://opriva.in/q/S-201</span>
                  </p>
                  <span className="text-[9px] text-white/50 block text-right">10:15 AM</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#202c33] border-t border-white/10 text-center">
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
              >
                Close WhatsApp Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
