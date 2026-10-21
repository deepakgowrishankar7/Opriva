import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Trash2, 
  Globe, 
  Phone, 
  Users, 
  Stethoscope, 
  Sparkles, 
  X,
  Search,
  ExternalLink,
  ChevronRight,
  Award,
  KeyRound,
  LogOut,
  Hospital,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Tv
} from 'lucide-react';
import { 
  HospitalNetwork, 
  HospitalBranch, 
  getHospitalNetworks, 
  saveHospitalNetworks, 
  addHospitalNetwork, 
  addHospitalBranch, 
  updateHospitalStatus, 
  updateBranchStatus, 
  deleteHospital,
  INITIAL_HOSPITAL_NETWORKS 
} from '../services/hospitalDirectoryService';

interface AdminDashboardPageProps {
  onBackToPortal?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onBackToPortal }) => {
  // Authentication State for Creator Admin
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('opriva_admin_session') === 'authenticated';
  });
  const [adminPasscode, setAdminPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Hospital Directory State
  const [hospitals, setHospitals] = useState<HospitalNetwork[]>(() => getHospitalNetworks());
  const [activeTab, setActiveTab] = useState<'hospitals' | 'onboard' | 'branches' | 'credentials'>('hospitals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospitalForBranch, setSelectedHospitalForBranch] = useState<string>(hospitals[0]?.id || 'apollo');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Onboard New Hospital Form State
  const [hospName, setHospName] = useState('');
  const [hospCode, setHospCode] = useState('');
  const [hospTagline, setHospTagline] = useState('');
  const [hospWebsite, setHospWebsite] = useState('');
  const [hospStatus, setHospStatus] = useState<'ACTIVE' | 'PILOT' | 'ONBOARDING'>('ACTIVE');
  const [hospBadge, setHospBadge] = useState('Authorized Enterprise Partner');
  const [hospAccreditations, setHospAccreditations] = useState('NABH, ABDM M1 & M2 Certified');

  // Primary branch
  const [branchName, setBranchName] = useState('');
  const [branchLocality, setBranchLocality] = useState('');
  const [branchCity, setBranchCity] = useState('');
  const [branchState, setBranchState] = useState('');
  const [branchCounters, setBranchCounters] = useState('Counter 1 • General OP Registration, Counter 2 • Senior Care');
  const [branchDoctorRooms, setBranchDoctorRooms] = useState('Room 101 • General Medicine, Room 102 • Pediatrics');
  const [receptionistEmail, setReceptionistEmail] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [department, setDepartment] = useState('General Outpatient Department (OPD)');
  const [branchPhone, setBranchPhone] = useState('+91 ');

  // Branch addition form
  const [newBranchLocality, setNewBranchLocality] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('');
  const [newBranchState, setNewBranchState] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchDoctorName, setNewBranchDoctorName] = useState('');
  const [newBranchDepartment, setNewBranchDepartment] = useState('General Medicine');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Creator Admin Master Passcode
    if (adminPasscode === 'opriva2026' || adminPasscode === 'admin123') {
      sessionStorage.setItem('opriva_admin_session', 'authenticated');
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Incorrect Creator Admin Passkey. Access restricted to platform creator.');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('opriva_admin_session');
    setIsAuthenticated(false);
  };

  const refreshHospitals = () => {
    const list = getHospitalNetworks();
    setHospitals([...list]);
  };

  const handleCreateHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospName.trim() || !branchCity.trim()) {
      alert('Please fill out hospital name and branch city.');
      return;
    }

    const countersArr = branchCounters.split(',').map(s => s.trim()).filter(Boolean);
    const roomsArr = branchDoctorRooms.split(',').map(s => s.trim()).filter(Boolean);
    const accreditationsArr = hospAccreditations.split(',').map(s => s.trim()).filter(Boolean);

    const generatedCode = hospCode.trim() || hospName.slice(0, 4).toUpperCase();
    const primaryBranchId = hospName.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + branchCity.toLowerCase().replace(/[^a-z0-9]/g, '');

    const primaryBranch: HospitalBranch = {
      id: primaryBranchId,
      name: branchName.trim() || `${hospName} (${branchLocality || branchCity})`,
      locality: branchLocality.trim() || `${branchCity} Central`,
      city: branchCity.trim(),
      state: branchState.trim() || 'State',
      counters: countersArr.length > 0 ? countersArr : ['Counter 1 • General OP Desk'],
      doctorRooms: roomsArr.length > 0 ? roomsArr : ['Room 101 • General OPD'],
      receptionistEmail: receptionistEmail.trim() || `reception.${branchCity.toLowerCase()}@${generatedCode.toLowerCase()}.opriva.com`,
      doctorEmail: doctorEmail.trim() || `doctor.${branchCity.toLowerCase()}@${generatedCode.toLowerCase()}.opriva.com`,
      doctorName: doctorName.trim() || 'Dr. Consultant Physician, MD',
      department: department.trim() || 'General OPD',
      status: hospStatus === 'ACTIVE' ? 'ACTIVE' : 'ONBOARDING',
      contactPhone: branchPhone.trim(),
      dailyOpdCapacity: 500
    };

    const newHosp = addHospitalNetwork({
      name: hospName.trim(),
      code: generatedCode,
      tagline: hospTagline.trim() || 'Authorized Opriva Healthcare Partner',
      status: hospStatus,
      badge: hospBadge.trim() || 'Enterprise Partner',
      website: hospWebsite.trim(),
      accreditations: accreditationsArr,
      branches: [primaryBranch]
    });

    refreshHospitals();
    triggerToast(`🎉 Successfully onboarded ${newHosp.name} (${primaryBranch.city})! App & Staff logins active.`);

    setHospName('');
    setHospCode('');
    setHospTagline('');
    setBranchName('');
    setBranchLocality('');
    setBranchCity('');
    setBranchState('');
    setReceptionistEmail('');
    setDoctorEmail('');
    setDoctorName('');
    setActiveTab('hospitals');
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchCity.trim() || !selectedHospitalForBranch) {
      alert('Please select hospital and city.');
      return;
    }

    const hosp = hospitals.find(h => h.id === selectedHospitalForBranch);
    const hospCodeStr = hosp?.code.toLowerCase() || 'hospital';

    const branch = addHospitalBranch(selectedHospitalForBranch, {
      name: newBranchName.trim() || `${hosp?.name} (${newBranchLocality || newBranchCity})`,
      locality: newBranchLocality.trim() || `${newBranchCity} Main`,
      city: newBranchCity.trim(),
      state: newBranchState.trim() || 'State',
      counters: ['Counter 1 • Outpatient Registration Desk', 'Counter 2 • Fast Track Counter'],
      doctorRooms: ['Room 101 • Outpatient Consultant', 'Room 102 • Diagnostic Specialist'],
      receptionistEmail: `reception.${newBranchCity.toLowerCase()}@${hospCodeStr}.opriva.com`,
      doctorEmail: `dr.${newBranchCity.toLowerCase()}@${hospCodeStr}.opriva.com`,
      doctorName: newBranchDoctorName.trim() || 'Dr. Senior Consultant, MBBS MD',
      department: newBranchDepartment.trim() || 'General OPD',
      status: 'ACTIVE',
      dailyOpdCapacity: 500
    });

    if (branch) {
      refreshHospitals();
      triggerToast(`✅ Branch ${branch.name} registered and activated under ${hosp?.name}!`);
      setNewBranchName('');
      setNewBranchLocality('');
      setNewBranchCity('');
      setNewBranchState('');
      setActiveTab('hospitals');
    }
  };

  // If Creator is NOT authenticated, show the Master Admin Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-700 animate-scaleUp">
          
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto mb-6 text-teal-700 shadow-xs">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="text-center mb-6">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-[10px] font-black uppercase tracking-wider">
              Creator Master Console
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">Opriva Super-Admin</h1>
            <p className="text-xs text-slate-500 mt-1">
              Restricted platform gateway. Enter your master passkey to manage hospital networks, branches, and staff credentials.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Master Passkey
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter creator passkey (e.g. admin123)"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none font-mono"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Unlock Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {onBackToPortal && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <button
                onClick={onBackToPortal}
                className="text-xs text-slate-500 hover:text-teal-700 font-bold"
              >
                ← Return to Hospital Staff Gateway
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // Creator Admin Dashboard Layout
  const totalBranches = hospitals.reduce((acc, h) => acc + h.branches.length, 0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight">Opriva Platform HQ</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-400 text-slate-950 uppercase">
                  Creator Super-Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Multi-Hospital Network & Staff Credentials Manager</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onBackToPortal && (
              <button
                onClick={onBackToPortal}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition"
              >
                View Staff Portal
              </button>
            )}
            <button
              onClick={handleAdminLogout}
              className="px-3 py-1.5 rounded-xl bg-red-950/50 hover:bg-red-900 text-red-200 border border-red-800/60 text-xs font-bold flex items-center space-x-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>
          </div>

        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white">✕</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partner Hospitals</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{hospitals.length}</div>
              <span className="text-[11px] text-teal-600 font-bold">Approved Institutions</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Hospital className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Regional Branches</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalBranches}</div>
              <span className="text-[11px] text-indigo-600 font-bold">Live Facilities</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile App Sync</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">100%</div>
              <span className="text-[11px] text-emerald-700 font-bold">Auto-Pushed to Patients</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Credentials</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalBranches * 2}</div>
              <span className="text-[11px] text-slate-500 font-bold">Reception + Doctor Logins</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'hospitals'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Hospitals Directory ({hospitals.length})
            </button>
            <button
              onClick={() => setActiveTab('onboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'onboard'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Onboard New Hospital</span>
            </button>
            <button
              onClick={() => setActiveTab('branches')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'branches'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>+ Add Regional Branch</span>
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'credentials'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Staff Login Matrix</span>
            </button>
          </div>

          {activeTab === 'hospitals' && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search hospital or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-56"
              />
            </div>
          )}
        </div>

        {/* TAB 1: HOSPITALS LIST */}
        {activeTab === 'hospitals' && (
          <div className="space-y-4">
            {hospitals.map(hosp => (
              <div key={hosp.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 border border-teal-300 flex items-center justify-center font-black text-teal-800 text-base">
                      {hosp.code.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-slate-900 text-base">{hosp.name}</h3>
                        <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                          {hosp.code}
                        </span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          hosp.status === 'ACTIVE' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {hosp.status === 'ACTIVE' ? 'LIVE IN MOBILE APP' : 'ONBOARDING PREP'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 italic mt-0.5">{hosp.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const next = hosp.status === 'ACTIVE' ? 'ONBOARDING' : 'ACTIVE';
                        updateHospitalStatus(hosp.id, next);
                        refreshHospitals();
                        triggerToast(`Hospital ${hosp.name} status updated to ${next}`);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 bg-white hover:bg-slate-100"
                    >
                      {hosp.status === 'ACTIVE' ? 'Pause Mobile Visibility' : 'Activate in Mobile App'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedHospitalForBranch(hosp.id);
                        setActiveTab('branches');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Branch</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete hospital network ${hosp.name}?`)) {
                          deleteHospital(hosp.id);
                          refreshHospitals();
                          triggerToast(`Deleted ${hosp.name}`);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Delete network"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Branches List */}
                <div className="p-5 space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Branches & OPD Chambers ({hosp.branches.length})
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hosp.branches.map(branch => (
                      <div key={branch.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <span>{branch.name}</span>
                            </h4>
                            <p className="text-xs text-slate-500 pl-5">{branch.locality}, {branch.city}, {branch.state}</p>
                          </div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {branch.status}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-200 text-xs space-y-1.5">
                          <div className="flex items-center space-x-2 text-slate-700">
                            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Receptionist: <strong>{branch.receptionistEmail}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-700">
                            <Stethoscope className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>Doctor: <strong>{branch.doctorName}</strong> ({branch.doctorEmail})</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                          <span>{branch.counters.length} Counters • {branch.doctorRooms.length} Chambers</span>
                          <span className="font-bold text-teal-700">Default Password: password123</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: ONBOARD NEW HOSPITAL */}
        {activeTab === 'onboard' && (
          <form onSubmit={handleCreateHospital} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <span>Onboard New Partner Hospital</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Provide institution details and set up initial reception and doctor credentials. This will immediately publish the hospital to the patient mobile app.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Enterprise Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yashoda Hospitals"
                  value={hospName}
                  onChange={(e) => setHospName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Code *</label>
                <input
                  type="text"
                  placeholder="e.g. YASHODA, CARE, KIMS"
                  value={hospCode}
                  onChange={(e) => setHospCode(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg outline-none uppercase font-mono focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Motto / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Dedicated to Medical Excellence"
                  value={hospTagline}
                  onChange={(e) => setHospTagline(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Visibility</label>
                <select
                  value={hospStatus}
                  onChange={(e) => setHospStatus(e.target.value as any)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                >
                  <option value="ACTIVE">ACTIVE (Show in Patient Mobile App & Enable Staff Login)</option>
                  <option value="ONBOARDING">ONBOARDING (Staff Prep Only)</option>
                </select>
              </div>
            </div>

            {/* Primary Branch Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Primary Branch & Location
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Branch Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Yashoda Hospital (Secunderabad)"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Locality *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexander Road"
                    value={branchLocality}
                    onChange={(e) => setBranchLocality(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad"
                    value={branchCity}
                    onChange={(e) => setBranchCity(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Generated Staff Accounts */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Staff Authentication Credentials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Receptionist Login Email</label>
                  <input
                    type="email"
                    placeholder="reception@yashoda.opriva.com"
                    value={receptionistEmail}
                    onChange={(e) => setReceptionistEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Doctor In-Charge Name & Email</label>
                  <input
                    type="text"
                    placeholder="Dr. Chandra Shekhar, MD"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('hospitals')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Publish Hospital</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: ADD REGIONAL BRANCH */}
        {activeTab === 'branches' && (
          <form onSubmit={handleCreateBranch} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-teal-600" />
                <span>Add Regional Branch to Hospital Network</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Expand an onboarded hospital network with a new city branch and consultation chambers.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Hospital Network *</label>
                <select
                  value={selectedHospitalForBranch}
                  onChange={(e) => setSelectedHospitalForBranch(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 outline-none"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.code}) — {h.branches.length} Current Branches
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Branch Facility Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apollo Hospital (Hitec City)"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad, Vijayawada"
                    value={newBranchCity}
                    onChange={(e) => setNewBranchCity(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Locality</label>
                  <input
                    type="text"
                    placeholder="e.g. Madhapur"
                    value={newBranchLocality}
                    onChange={(e) => setNewBranchLocality(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('hospitals')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Register & Launch Branch</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: CREDENTIALS MATRIX */}
        {activeTab === 'credentials' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-teal-600" />
                <span>Hospital Staff Credentials Directory</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                All staff logins configured by you for receptionists and doctors across hospital branches.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3">Hospital & Branch</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Login Identifier (Email)</th>
                    <th className="p-3">Default Pass</th>
                    <th className="p-3">Chamber / Desk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {hospitals.flatMap(h => 
                    h.branches.flatMap(b => [
                      {
                        hosp: h.name,
                        branch: b.name,
                        role: 'OP Reception Desk',
                        email: b.receptionistEmail,
                        station: b.counters[0] || 'Counter 1'
                      },
                      {
                        hosp: h.name,
                        branch: b.name,
                        role: `Doctor (${b.doctorName})`,
                        email: b.doctorEmail,
                        station: b.doctorRooms[0] || 'Room 101'
                      }
                    ])
                  ).map((cred, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{cred.hosp} — {cred.branch}</td>
                      <td className="p-3 font-bold text-teal-700">{cred.role}</td>
                      <td className="p-3 font-mono text-slate-800">{cred.email}</td>
                      <td className="p-3 font-mono text-slate-500">password123</td>
                      <td className="p-3 text-slate-600">{cred.station}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
