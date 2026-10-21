import React, { useState, useEffect } from 'react';
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
  Phone,
  Eye,
  EyeOff,
  ChevronRight,
  MapPin,
  Check,
  AlertTriangle,
  QrCode,
  FileText,
  Volume2,
  Activity,
  Layers,
  HeartPulse,
  Smartphone,
  ExternalLink,
  Plus,
  Settings,
  X
} from 'lucide-react';
import { 
  HospitalNetwork, 
  HospitalBranch, 
  getHospitalNetworks 
} from '../services/hospitalDirectoryService';
import { HospitalManagementModal } from '../components/HospitalManagementModal';

interface HospitalStaffIndexProps {
  onSelectStation: (station: 'receptionist' | 'clinical' | 'tv-display') => void;
}

export const HospitalStaffIndex: React.FC<HospitalStaffIndexProps> = ({ onSelectStation }) => {
  const { login, switchDemoRole } = useAuth();

  // Dynamic Hospital Directory from Service
  const [hospitalNetworks, setHospitalNetworks] = useState<HospitalNetwork[]>(() => getHospitalNetworks());
  const [isManagementOpen, setIsManagementOpen] = useState(false);

  // Sync hospital networks on storage events or modal updates
  const reloadHospitalNetworks = () => {
    const list = getHospitalNetworks();
    setHospitalNetworks([...list]);
  };

  useEffect(() => {
    const handleUpdate = () => reloadHospitalNetworks();
    window.addEventListener('opriva-hospitals-updated', handleUpdate);
    return () => window.removeEventListener('opriva-hospitals-updated', handleUpdate);
  }, []);

  // Login Modal & Selection States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Hospital and Branch Selection
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(() => hospitalNetworks[0]?.id || 'apollo');
  const selectedHospital = hospitalNetworks.find(h => h.id === selectedHospitalId) || hospitalNetworks[0] || {
    id: 'apollo',
    name: 'Apollo Hospitals Enterprise',
    code: 'APOLLO',
    tagline: 'Healthcare',
    status: 'ACTIVE',
    badge: 'Partner',
    branches: []
  };
  
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => selectedHospital.branches[0]?.id || 'apollo-hyd-jubilee');
  const selectedBranch = selectedHospital.branches.find(b => b.id === selectedBranchId) || selectedHospital.branches[0] || {
    id: 'default',
    name: 'Main Branch',
    locality: 'Central',
    city: 'Hyderabad',
    state: 'Telangana',
    counters: ['Counter 1 • OPD Desk'],
    doctorRooms: ['Room 101 • General OPD'],
    receptionistEmail: 'reception@opriva.com',
    doctorEmail: 'doctor@opriva.com',
    doctorName: 'Dr. Physician',
    department: 'General OPD',
    status: 'ACTIVE'
  };

  // Role Selection (Receptionist vs Doctor vs Waiting TV)
  const [activeRole, setActiveRole] = useState<'receptionist' | 'clinical' | 'tv'>('receptionist');
  const [selectedDesk, setSelectedDesk] = useState(selectedBranch.counters[0] || 'Counter 1');
  const [selectedRoom, setSelectedRoom] = useState(selectedBranch.doctorRooms[0] || 'Room 102');

  // Credentials
  const [emailInput, setEmailInput] = useState(selectedBranch.receptionistEmail);
  const [passwordInput, setPasswordInput] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When Hospital selection changes, automatically pick its first branch
  const handleHospitalChange = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
    const hosp = hospitalNetworks.find(h => h.id === hospitalId) || hospitalNetworks[0];
    if (hosp && hosp.branches.length > 0) {
      const firstBranch = hosp.branches[0];
      setSelectedBranchId(firstBranch.id);
      setSelectedDesk(firstBranch.counters[0] || 'Counter 1');
      setSelectedRoom(firstBranch.doctorRooms[0] || 'Room 102');
      setErrorMsg(null);
      
      // Auto-update default email
      if (activeRole === 'receptionist') {
        setEmailInput(firstBranch.receptionistEmail);
      } else {
        setEmailInput(firstBranch.doctorEmail);
      }
    }
  };

  // When Branch selection changes
  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    const branch = selectedHospital.branches.find(b => b.id === branchId) || selectedHospital.branches[0];
    setSelectedDesk(branch.counters[0] || 'Counter 1');
    setSelectedRoom(branch.doctorRooms[0] || 'Room 102');
    setErrorMsg(null);

    if (activeRole === 'receptionist') {
      setEmailInput(branch.receptionistEmail);
    } else {
      setEmailInput(branch.doctorEmail);
    }
  };

  // Switch role between Receptionist, Doctor, TV
  const handleRoleSwitch = (role: 'receptionist' | 'clinical' | 'tv') => {
    setActiveRole(role);
    setErrorMsg(null);
    if (role === 'receptionist') {
      setEmailInput(selectedBranch.receptionistEmail);
      setPasswordInput('password123');
    } else if (role === 'clinical') {
      setEmailInput(selectedBranch.doctorEmail);
      setPasswordInput('password123');
    }
  };

  // Handle Form Submission with Branch Validation
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      // 1. Check if the hospital branch is in Onboarding status
      if (selectedBranch.status === 'ONBOARDING') {
        setErrorMsg(
          `Security Clearance Notice: ${selectedBranch.name} is currently undergoing ABDM/IT integration. Official staff login will be activated once institutional clearance is granted. For live testing, please select Apollo Health City (Jubilee Hills).`
        );
        setIsSubmitting(false);
        return;
      }

      // 2. Validate Branch-Specific Credential Match
      const trimmedEmail = emailInput.trim().toLowerCase();
      
      if (activeRole === 'receptionist') {
        // Must match branch receptionist email or authorized domain
        if (selectedBranch.id === 'apollo-hyd-jubilee') {
          if (trimmedEmail !== 'receptionist@apollo.opriva.com') {
            setErrorMsg(
              `Authentication Error: The credential "${emailInput}" does not match the active staff registry for ${selectedBranch.name}. Please enter "receptionist@apollo.opriva.com".`
            );
            setIsSubmitting(false);
            return;
          }
          await login(trimmedEmail, passwordInput);
          onSelectStation('receptionist');
        } else {
          setErrorMsg(
            `Access Denied: Staff ID "${emailInput}" is not assigned to ${selectedBranch.name}. Please select your registered branch.`
          );
          setIsSubmitting(false);
          return;
        }
      } else if (activeRole === 'clinical') {
        // Must match branch doctor email
        if (selectedBranch.id === 'apollo-hyd-jubilee') {
          if (trimmedEmail !== 'dr.sharma@apollo.opriva.com') {
            setErrorMsg(
              `Authentication Error: Doctor ID "${emailInput}" is not recognized in the clinical directory for ${selectedBranch.name}. Please enter "dr.sharma@apollo.opriva.com".`
            );
            setIsSubmitting(false);
            return;
          }
          await login(trimmedEmail, passwordInput);
          onSelectStation('clinical');
        } else {
          setErrorMsg(
            `Access Denied: Clinician credentials do not match ${selectedBranch.name}.`
          );
          setIsSubmitting(false);
          return;
        }
      }
    } catch (err: any) {
      setErrorMsg('Invalid staff credentials. Please check your password or contact hospital IT.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1-Click Fast Fill for Apollo Jubilee Hills
  const handleQuickApolloLogin = async (role: 'receptionist' | 'clinical') => {
    setSelectedHospitalId('apollo');
    setSelectedBranchId('apollo-hyd-jubilee');
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (role === 'receptionist') {
        await switchDemoRole('ROLE_RECEPTIONIST');
        onSelectStation('receptionist');
      } else {
        await switchDemoRole('ROLE_CLINICIAN');
        onSelectStation('clinical');
      }
    } catch (err) {
      setErrorMsg('Quick login unavailable. Please sign in with standard credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-600 selection:text-white flex flex-col justify-between">
      
      {/* 1. TOP ENTERPRISE NAVIGATION BAR */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Opriva Hospital Enterprise Logo */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500/10 via-teal-50 to-white p-1.5 border border-teal-200 shadow-xs flex items-center justify-center">
              <img src="/logo.png" alt="Opriva" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">Opriva</span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-extrabold uppercase tracking-wider">
                  HOSPITAL ENTERPRISE OS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Outpatient Department Queue & Chamber Infrastructure</p>
            </div>
          </div>

          {/* Quick Info & Sign In Button */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-600 border-r border-slate-200 pr-4">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span className="font-semibold text-slate-700">ABDM & HIPAA Compliant</span>
              </div>
            </div>

            {/* Hospital Network Management Button */}
            <button
              onClick={() => setIsManagementOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs transition flex items-center space-x-2 cursor-pointer shadow-xs"
              title="Manage Partnered Hospitals, Branches & OPD Chambers"
            >
              <Settings className="w-4 h-4 text-teal-700" />
              <span className="hidden sm:inline">Manage Hospitals</span>
              <span className="px-1.5 py-0.2 rounded-full bg-teal-200/80 text-teal-900 text-[10px] font-bold">
                {hospitalNetworks.length}
              </span>
            </button>

            {/* Prominent Sign In Button */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center space-x-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Staff Workstation Sign In</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO PRESENTATION: WHAT OPRIVA DOES FOR HOSPITALS */}
      <section className="bg-gradient-to-b from-white via-teal-50/20 to-slate-50 border-b border-slate-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/60 border border-teal-200 text-teal-900 text-xs font-bold uppercase tracking-wider mb-6">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Empowering India’s Premier Hospital OPD Networks
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto">
            Healthcare, Without the Wait.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Opriva transforms chaotic outpatient reception desks into an automated, synchronized clinical engine with walk-in registrations, digital doctor chambers, and audio-guided waiting lounge monitors.
          </p>

          {/* Key Hospital Impact Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <div className="text-3xl font-black text-teal-600 font-mono">&lt; 30s</div>
              <span className="text-xs font-bold text-slate-800 block mt-1">Walk-in OP Registration</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Automated queue ticketing</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <div className="text-3xl font-black text-indigo-600 font-mono">82%</div>
              <span className="text-xs font-bold text-slate-800 block mt-1">Less Waiting Room Crowding</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Real-time turn notifications</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <div className="text-3xl font-black text-sky-600 font-mono">3-Lang</div>
              <span className="text-xs font-bold text-slate-800 block mt-1">Voice TV Announcements</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Telugu, Hindi & English chimes</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <div className="text-3xl font-black text-emerald-600 font-mono">100%</div>
              <span className="text-xs font-bold text-slate-800 block mt-1">Paperless OPD Slips</span>
              <p className="text-[11px] text-slate-500 mt-0.5">WhatsApp QR & Thermal Receipts</p>
            </div>

          </div>

          {/* Quick CTA Actions */}
          <div className="mt-10 flex items-center justify-center">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-lg shadow-teal-600/25 transition flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Select Hospital & Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. THREE DEDICATED WORKSTATIONS BREAKDOWN */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase text-teal-700 tracking-wider">Hospital Architecture</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Engineered For Every Staff Role
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Each workstation connects to the central cloud queue with real-time updates across departments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: OP Reception Desk */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5 border border-teal-100">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Outpatient Reception Desk</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Empowers front-desk hospital staff to register walk-ins in under 30 seconds, collect cash/UPI fees, print 58mm/80mm thermal OPD cards, and dispatch digital WhatsApp tokens.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Normal OP (₹350) & Special Priority (₹750)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Emergency & Senior Citizen Priority Bypass</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Thermal Receipt Printing & WhatsApp Delivery</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                handleRoleSwitch('receptionist');
                setIsLoginModalOpen(true);
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Access Reception Desk</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Doctor Clinical Chamber */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-5 border border-indigo-100">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Doctor OPD Chamber</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                A streamlined clinical interface for consulting doctors. Real-time waiting list, 1-click patient calling that chimes the waiting lounge, and a rapid digital Rx prescription builder.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>1-Click "Call Next Patient" with TV Voice Ping</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Digital Prescription Writer with Dosage & Duration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Patient Medical History & Test Reports Vault</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                handleRoleSwitch('clinical');
                setIsLoginModalOpen(true);
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Access Doctor Chamber</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Waiting Hall TV Display */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-5 border border-sky-100">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Waiting Hall Live TV Board</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Full-screen 1080p/4K public queue monitor for waiting lounges. Displays huge token numbers, room indicators, and speaks audio announcements in Telugu, Hindi, and English.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Instant Audio Chime on Token Call</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Multi-Lingual Text-to-Speech Voice</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Upcoming Queue Sequence & Wait Estimates</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                handleRoleSwitch('tv');
                setIsLoginModalOpen(true);
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Launch Live TV Board</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. HOSPITAL PARTNER NETWORK OVERVIEW */}
      <section className="bg-slate-100/70 border-t border-b border-slate-200 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Multi-Institutional Network</span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Supported Hospital Networks & Regional Branches
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-slate-500 hidden sm:inline">
                {hospitalNetworks.length} Networks • {hospitalNetworks.reduce((acc, h) => acc + h.branches.length, 0)} Active Branches
              </span>
              <button
                onClick={() => setIsManagementOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Onboard Hospital</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hospitalNetworks.map(net => (
              <div 
                key={net.id}
                onClick={() => {
                  handleHospitalChange(net.id);
                  setIsLoginModalOpen(true);
                }}
                className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer ${
                  net.id === 'apollo' 
                    ? 'border-teal-400 shadow-sm hover:border-teal-500 ring-2 ring-teal-500/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                    net.status === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {net.status === 'ACTIVE' ? 'Live System' : 'Integration Pilot'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">{net.branches.length} Branches</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm">{net.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1 italic">"{net.tagline}"</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                  {net.branches.slice(0, 2).map(b => (
                    <div key={b.id} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{b.name}</span>
                    </div>
                  ))}
                  {net.branches.length > 2 && (
                    <span className="text-[10px] text-teal-700 font-bold block pt-1">
                      +{net.branches.length - 2} more branches
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-black text-slate-800">Opriva Hospital Enterprise System</span>
            <span>•</span>
            <span>Apollo Health City & National Hospital Network</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Hospital IT Helpdesk: ext. 4401</span>
            <span>•</span>
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-teal-700 font-bold hover:underline"
            >
              Staff Portal Sign In
            </button>
          </div>
        </div>
      </footer>

      {/* 6. HOSPITAL & BRANCH-SPECIFIC LOGIN MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Building2 className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Hospital Workstation Authentication</h3>
                  <p className="text-[11px] text-slate-500">Select your hospital network, branch, and role</p>
                </div>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* STEP 1: SELECT HOSPITAL NETWORK */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    1. Hospital Network
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      setIsManagementOpen(true);
                    }}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add New Hospital</span>
                  </button>
                </div>
                <select
                  value={selectedHospitalId}
                  onChange={(e) => handleHospitalChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  {hospitalNetworks.map(net => (
                    <option key={net.id} value={net.id}>
                      {net.name} {net.status === 'ACTIVE' ? '• (Active System)' : '• (Partner Integration)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* STEP 2: SELECT HOSPITAL BRANCH */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  2. Hospital Branch Location
                </label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  {selectedHospital.branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} — {branch.city}, {branch.state}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Locality: {selectedBranch.locality}, {selectedBranch.city}
                </span>
              </div>

              {/* STEP 3: WORKSTATION ROLE TOGGLE (Receptionist vs Doctor vs TV) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  3. Select Duty Workstation
                </label>
                <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('receptionist')}
                    className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                      activeRole === 'receptionist'
                        ? 'bg-white text-teal-800 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>Reception Desk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('clinical')}
                    className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                      activeRole === 'clinical'
                        ? 'bg-white text-indigo-800 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Doctor OPD</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('tv')}
                    className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                      activeRole === 'tv'
                        ? 'bg-white text-sky-800 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Tv className="w-3.5 h-3.5 text-sky-600" />
                    <span>Waiting TV</span>
                  </button>
                </div>
              </div>

              {/* Error Message Alert */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Validation Alert: </span>
                    {errorMsg}
                  </div>
                </div>
              )}

              {/* ROLE-SPECIFIC LOGIN FORM */}
              {activeRole !== 'tv' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1">
                  
                  {activeRole === 'receptionist' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Assigned Counter Desk
                      </label>
                      <select
                        value={selectedDesk}
                        onChange={(e) => setSelectedDesk(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      >
                        {selectedBranch.counters.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {activeRole === 'clinical' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Doctor Consulting Chamber
                      </label>
                      <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      >
                        {selectedBranch.doctorRooms.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Staff Email Address (Must Match {selectedBranch.name})
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center space-x-2"
                    >
                      <span>
                        {isSubmitting 
                          ? 'Validating Credentials...' 
                          : `Sign In to ${selectedBranch.name}`
                        }
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* 1-Click Demo Fill for Apollo Jubilee Hills */}
                    <button
                      type="button"
                      onClick={() => handleQuickApolloLogin(activeRole)}
                      className="w-full py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>1-Click Apollo Jubilee Hills Verified Sign In</span>
                    </button>
                  </div>

                </form>
              ) : (
                /* WAITING HALL TV 1-CLICK LAUNCH */
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto border border-sky-200">
                    <Tv className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Waiting Hall TV Lounge Monitor</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Launch the public display for {selectedBranch.name}. Features automated audio chimes and voice announcements in English, Hindi, and Telugu.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      onSelectStation('tv-display');
                    }}
                    className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition flex items-center justify-center space-x-2"
                  >
                    <span>Launch Full Screen TV Display</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Institutional Intranet • HIPAA & ABDM Compliant</span>
            </div>

          </div>
        </div>
      )}

      {/* 7. HOSPITAL & BRANCH MANAGEMENT MODAL */}
      <HospitalManagementModal
        isOpen={isManagementOpen}
        onClose={() => setIsManagementOpen(false)}
        onHospitalsChanged={reloadHospitalNetworks}
      />

    </div>
  );
};
