import React, { useState } from 'react';
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
  Award
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

interface HospitalManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHospitalsChanged?: () => void;
}

export const HospitalManagementModal: React.FC<HospitalManagementModalProps> = ({
  isOpen,
  onClose,
  onHospitalsChanged
}) => {
  const [hospitals, setHospitals] = useState<HospitalNetwork[]>(() => getHospitalNetworks());
  const [activeTab, setActiveTab] = useState<'list' | 'add-hospital' | 'add-branch'>('list');
  const [selectedHospitalForBranch, setSelectedHospitalForBranch] = useState<string>(hospitals[0]?.id || 'apollo');
  const [searchQuery, setSearchQuery] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Hospital Form State
  const [hospName, setHospName] = useState('');
  const [hospCode, setHospCode] = useState('');
  const [hospTagline, setHospTagline] = useState('');
  const [hospWebsite, setHospWebsite] = useState('');
  const [hospStatus, setHospStatus] = useState<'ACTIVE' | 'PILOT' | 'ONBOARDING'>('ACTIVE');
  const [hospBadge, setHospBadge] = useState('Authorized Enterprise Partner');
  const [hospAccreditations, setHospAccreditations] = useState('NABH, ABDM M1 & M2 Certified');

  // Primary branch for new hospital
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
  const [branchCapacity, setBranchCapacity] = useState('350');

  // Single Branch Addition Form State
  const [newBranchLocality, setNewBranchLocality] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('');
  const [newBranchState, setNewBranchState] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchReceptionEmail, setNewBranchReceptionEmail] = useState('');
  const [newBranchDoctorEmail, setNewBranchDoctorEmail] = useState('');
  const [newBranchDoctorName, setNewBranchDoctorName] = useState('');
  const [newBranchDepartment, setNewBranchDepartment] = useState('General Medicine');
  const [newBranchPhone, setNewBranchPhone] = useState('');

  const refreshHospitals = () => {
    const list = getHospitalNetworks();
    setHospitals([...list]);
    if (onHospitalsChanged) onHospitalsChanged();
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to reset all hospitals to default seeded demo networks?')) {
      saveHospitalNetworks(INITIAL_HOSPITAL_NETWORKS);
      refreshHospitals();
      triggerToast('Reset to default hospital directory.');
    }
  };

  const handleCreateHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospName.trim() || !branchCity.trim()) {
      alert('Please fill out hospital name and primary branch city.');
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
      receptionistEmail: receptionistEmail.trim() || `reception@${generatedCode.toLowerCase()}.opriva.com`,
      doctorEmail: doctorEmail.trim() || `doctor@${generatedCode.toLowerCase()}.opriva.com`,
      doctorName: doctorName.trim() || 'Dr. Consultant, MD',
      department: department.trim() || 'General OPD',
      status: hospStatus === 'ACTIVE' ? 'ACTIVE' : 'ONBOARDING',
      contactPhone: branchPhone.trim(),
      dailyOpdCapacity: parseInt(branchCapacity) || 400
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
    triggerToast(`🎉 Successfully onboarded ${newHosp.name} with branch in ${primaryBranch.city}!`);
    
    // Reset inputs
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
    setActiveTab('list');
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchCity.trim() || !selectedHospitalForBranch) {
      alert('Please fill out the branch city and hospital.');
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
      receptionistEmail: newBranchReceptionEmail.trim() || `reception.${newBranchCity.toLowerCase()}@${hospCodeStr}.opriva.com`,
      doctorEmail: newBranchDoctorEmail.trim() || `dr.${newBranchCity.toLowerCase()}@${hospCodeStr}.opriva.com`,
      doctorName: newBranchDoctorName.trim() || 'Dr. Senior Consultant, MBBS MD',
      department: newBranchDepartment.trim() || 'Outpatient Services',
      status: 'ACTIVE',
      contactPhone: newBranchPhone.trim(),
      dailyOpdCapacity: 500
    });

    if (branch) {
      refreshHospitals();
      triggerToast(`✅ Added new branch in ${branch.city} to ${hosp?.name}!`);
      setNewBranchName('');
      setNewBranchLocality('');
      setNewBranchCity('');
      setNewBranchState('');
      setNewBranchDoctorName('');
      setActiveTab('list');
    }
  };

  const handleToggleHospStatus = (hosp: HospitalNetwork) => {
    const nextStatus = hosp.status === 'ACTIVE' ? 'ONBOARDING' : 'ACTIVE';
    updateHospitalStatus(hosp.id, nextStatus);
    refreshHospitals();
    triggerToast(`Hospital ${hosp.name} set to ${nextStatus}`);
  };

  const handleToggleBranchStatus = (hospId: string, branch: HospitalBranch) => {
    const nextStatus = branch.status === 'ACTIVE' ? 'ONBOARDING' : 'ACTIVE';
    updateBranchStatus(hospId, branch.id, nextStatus);
    refreshHospitals();
    triggerToast(`Branch ${branch.name} set to ${nextStatus}`);
  };

  const handleDeleteHospital = (hospId: string, hospName: string) => {
    if (confirm(`Are you sure you want to delete ${hospName}? All its branches and queues will be removed.`)) {
      deleteHospital(hospId);
      refreshHospitals();
      triggerToast(`Deleted ${hospName}`);
    }
  };

  if (!isOpen) return null;

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.branches.some(b => b.city.toLowerCase().includes(searchQuery.toLowerCase()) || b.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Building2 className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-tight">Hospital & Branch Network Administration</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-400 text-teal-950 uppercase tracking-wider">
                  SaaS Manager
                </span>
              </div>
              <p className="text-teal-100/80 text-xs mt-0.5">
                Onboard new partnered hospitals, add regional branches, configure doctors, and control live patient visibility.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-200 hover:text-white">✕</button>
          </div>
        )}

        {/* Tab Controls & Search */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 bg-slate-200/70 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'list' 
                  ? 'bg-white text-teal-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Hospitals ({hospitals.length})
            </button>
            <button
              onClick={() => setActiveTab('add-hospital')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'add-hospital' 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Onboard New Hospital</span>
            </button>
            <button
              onClick={() => setActiveTab('add-branch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'add-branch' 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>+ Add Branch</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'list' && (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter hospitals, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-48 sm:w-60"
                />
              </div>
            )}
            <button
              onClick={handleResetToDefault}
              className="text-[11px] text-slate-500 hover:text-red-600 font-semibold underline px-2 py-1"
              title="Reset data back to original Apollo, AIIMS, Manipal, Fortis seed"
            >
              Reset Seed
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50">
          
          {/* TAB 1: HOSPITAL LIST & DIRECTORY */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Total Participating Networks: <strong className="text-slate-800">{filteredHospitals.length}</strong></span>
                <span>Active Branch Count: <strong className="text-teal-700">{filteredHospitals.reduce((acc, h) => acc + h.branches.length, 0)} Branches</strong></span>
              </div>

              {filteredHospitals.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">No hospitals match your search</p>
                  <p className="text-xs text-slate-500 mt-1">Try another keyword or click "+ Onboard New Hospital" above.</p>
                </div>
              ) : (
                filteredHospitals.map((hosp) => (
                  <div key={hosp.id} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all overflow-hidden">
                    {/* Hospital Head */}
                    <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center font-black text-teal-800 text-sm">
                          {hosp.code.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-slate-900 text-sm">{hosp.name}</h3>
                            <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                              {hosp.code}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              hosp.status === 'ACTIVE' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {hosp.status === 'ACTIVE' ? '● LIVE & ACTIVE' : '◐ ONBOARDING / PILOT'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 italic mt-0.5">{hosp.tagline}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleHospStatus(hosp)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                            hosp.status === 'ACTIVE'
                              ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          {hosp.status === 'ACTIVE' ? 'Set to Onboarding' : 'Activate Live'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedHospitalForBranch(hosp.id);
                            setActiveTab('add-branch');
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg font-bold bg-teal-50 text-teal-700 border border-teal-300 hover:bg-teal-100 transition-colors flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Branch</span>
                        </button>
                        <button
                          onClick={() => handleDeleteHospital(hosp.id, hosp.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete hospital"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Accreditations bar */}
                    {hosp.accreditations && hosp.accreditations.length > 0 && (
                      <div className="px-4 py-1.5 bg-slate-100/70 border-b border-slate-200 flex items-center space-x-2 text-[11px] text-slate-600 overflow-x-auto">
                        <Award className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="font-semibold text-slate-700">Accreditations:</span>
                        {hosp.accreditations.map((acc, i) => (
                          <span key={i} className="bg-white border border-slate-200 px-2 py-0.2 rounded-md font-medium text-slate-700 text-[10px]">
                            {acc}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Branches Breakdown */}
                    <div className="p-4 space-y-3">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Regional Branches & OPD Chambers ({hosp.branches.length})</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {hosp.branches.map((b) => (
                          <div 
                            key={b.id} 
                            className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                                    <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                                    <span>{b.name}</span>
                                  </h4>
                                  <p className="text-[11px] text-slate-500 pl-4">
                                    {b.locality}, {b.city}, {b.state}
                                  </p>
                                </div>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  b.status === 'ACTIVE' 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {b.status}
                                </span>
                              </div>

                              <div className="mt-2.5 pt-2 border-t border-slate-200/70 space-y-1 text-[11px] text-slate-600">
                                <div className="flex items-center space-x-1.5">
                                  <Users className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">Receptionist: <strong className="text-slate-800">{b.receptionistEmail}</strong></span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <Stethoscope className="w-3 h-3 text-teal-600 shrink-0" />
                                  <span className="truncate">Physician: <strong className="text-slate-800">{b.doctorName}</strong> ({b.department})</span>
                                </div>
                                {b.contactPhone && (
                                  <div className="flex items-center space-x-1.5">
                                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>Helpline: {b.contactPhone}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                              <span className="text-slate-500">
                                {b.counters.length} OP Counters • {b.doctorRooms.length} Chambers
                              </span>
                              <button
                                onClick={() => handleToggleBranchStatus(hosp.id, b)}
                                className="font-bold text-teal-700 hover:text-teal-900 underline"
                              >
                                {b.status === 'ACTIVE' ? 'Suspend Branch' : 'Activate Branch'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: ONBOARD NEW HOSPITAL */}
          {activeTab === 'add-hospital' && (
            <form onSubmit={handleCreateHospital} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <span>Onboard New Hospital Network</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter institution credentials and create its primary launch branch. Once activated, patients can book OP cards and hospital staff can sign in immediately.
                </p>
              </div>

              {/* Section 1: Institution Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Hospital Enterprise Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hospital Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Care Hospitals Network"
                      value={hospName}
                      onChange={(e) => setHospName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Code (for Tokens & Logins)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CARE, MAX, YASHODA"
                      value={hospCode}
                      onChange={(e) => setHospCode(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Motto / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Transforming Healthcare with Compassion"
                      value={hospTagline}
                      onChange={(e) => setHospTagline(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Initial Service Status
                    </label>
                    <select
                      value={hospStatus}
                      onChange={(e) => setHospStatus(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                      <option value="ACTIVE">ACTIVE (Live for Booking & Staff Sign-in)</option>
                      <option value="PILOT">PILOT (ABDM Sandbox Trial)</option>
                      <option value="ONBOARDING">ONBOARDING (Staff Only / Prep Mode)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Accreditations & Certificates (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NABH Accredited, JCI, NABL Lab, ABDM Milestone 1"
                      value={hospAccreditations}
                      onChange={(e) => setHospAccreditations(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Primary Branch Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Primary Hospital Branch / Facility Location
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Branch Facility Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Care Hospital (Banjara Hills)"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Locality / Street <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Road No. 1, Banjara Hills"
                      value={branchLocality}
                      onChange={(e) => setBranchLocality(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad, Mumbai, Pune"
                      value={branchCity}
                      onChange={(e) => setBranchCity(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      State / Union Territory
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Telangana, Maharashtra"
                      value={branchState}
                      onChange={(e) => setBranchState(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Helpline / Reception Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+91-40-6165-6565"
                      value={branchPhone}
                      onChange={(e) => setBranchPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Staff & Station Credentials */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. Initial Medical & Administrative Staff
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Receptionist Login Email
                    </label>
                    <input
                      type="email"
                      placeholder="reception@care.opriva.com"
                      value={receptionistEmail}
                      onChange={(e) => setReceptionistEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chief OPD Doctor Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Sudhir Kumar, MD"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Doctor Login Email
                    </label>
                    <input
                      type="email"
                      placeholder="dr.sudhir@care.opriva.com"
                      value={doctorEmail}
                      onChange={(e) => setDoctorEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Department
                    </label>
                    <input
                      type="text"
                      placeholder="General Medicine & Diagnostic OPD"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Onboard Hospital</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ADD NEW BRANCH TO EXISTING HOSPITAL */}
          {activeTab === 'add-branch' && (
            <form onSubmit={handleCreateBranch} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <span>Add Branch to Existing Hospital Network</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Expand a registered hospital brand with a new city branch, hospital building, or regional clinic.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Hospital Network <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedHospitalForBranch}
                    onChange={(e) => setSelectedHospitalForBranch(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.code}) — {h.branches.length} Current Branches
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      New Branch Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apollo Super Specialty (Kukatpally)"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad, Kolkata, Ahmedabad"
                      value={newBranchCity}
                      onChange={(e) => setNewBranchCity(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Locality / Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. KPHB Colony, 6th Phase"
                      value={newBranchLocality}
                      onChange={(e) => setNewBranchLocality(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Telangana"
                      value={newBranchState}
                      onChange={(e) => setNewBranchState(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700">Branch Staff Assignment</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Doctor In-Charge
                      </label>
                      <input
                        type="text"
                        placeholder="Dr. Name, MBBS MD"
                        value={newBranchDoctorName}
                        onChange={(e) => setNewBranchDoctorName(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        placeholder="General OPD"
                        value={newBranchDepartment}
                        onChange={(e) => setNewBranchDepartment(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register & Activate Branch</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Opriva Multi-Tenant Healthcare Isolation Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 transition-colors"
          >
            Close Administration
          </button>
        </div>

      </div>
    </div>
  );
};
