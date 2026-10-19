import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Upload, 
  FileText, 
  Users, 
  UserPlus, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Receipt,
  Share2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { hospitalApi, bookingApi, recordsApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { PaymentModal } from '../../components/PaymentModal';
import { DigitalReceiptModal } from '../../components/DigitalReceiptModal';

export const PatientPortal: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // State
  const [subTab, setSubTab] = useState<'hospitals' | 'queue' | 'records' | 'prescriptions' | 'dependents'>('hospitals');
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<any | null>(null);
  const [dependents, setDependents] = useState<any[]>([]);
  const [selectedDependentId, setSelectedDependentId] = useState<string>('');
  const [selectedSlotTime, setSelectedSlotTime] = useState('09:30 - 10:30 AM');
  const [loading, setLoading] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Booking & Payment
  const [reservationData, setReservationData] = useState<any | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [liveQueueData, setLiveQueueData] = useState<any | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Medical Records & Dependents
  const [records, setRecords] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [newDepName, setNewDepName] = useState('');
  const [newDepRel, setNewDepRel] = useState('Child');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('LAB_REPORT');
  const [uploadDesc, setUploadDesc] = useState('');

  // Fetch hospitals
  const loadHospitals = async (searchKw?: string) => {
    setLoading(true);
    try {
      // Hyderabad demo coordinates for realistic distance sorting
      const data = await hospitalApi.getHospitals({
        keyword: searchKw,
        lat: 17.4156,
        lon: 78.4121,
      });
      setHospitals(data);
      if (data.length > 0 && !selectedHospital) {
        setSelectedHospital(data[0]);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadDependents = async () => {
    try {
      const deps = await recordsApi.getDependents();
      setDependents(deps);
    } catch (e) {
      console.warn(e);
    }
  };

  const loadRecords = async () => {
    try {
      const docs = await recordsApi.getDocuments({
        patientId: user?.userId,
        dependentId: selectedDependentId || undefined,
      });
      setRecords(docs);
    } catch (e) {
      console.warn(e);
    }
  };

  const loadVisits = async () => {
    try {
      const v = await recordsApi.getVisitTimeline({
        patientId: user?.userId,
        dependentId: selectedDependentId || undefined,
      });
      setVisits(v);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadHospitals();
    loadDependents();
    loadRecords();
    loadVisits();
  }, []);

  useEffect(() => {
    loadRecords();
    loadVisits();
  }, [selectedDependentId]);

  // Initiate Slot Reservation
  const handleInitiateReservation = async (typeId: string) => {
    if (!selectedHospital) return;
    setLoading(true);
    try {
      const res = await bookingApi.createReservation({
        hospitalId: selectedHospital.id,
        opRegistrationTypeId: typeId,
        dependentId: selectedDependentId || undefined,
        sessionDate: new Date().toISOString().split('T')[0],
        slotTime: selectedSlotTime,
      });
      setReservationData(res);
      setIsPaymentOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to hold reservation slot');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (confirmation: any) => {
    setIsPaymentOpen(false);
    setConfirmedBooking(confirmation);
    setSubTab('queue');
    fetchLiveQueue(confirmation.registrationId);
  };

  const fetchLiveQueue = async (regId: string) => {
    try {
      const data = await bookingApi.getReceipt(regId).then(() =>
        // Fetch queue status
        fetch(`/api/v1/queue/live/${regId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('opriva_token')}` },
        }).then(r => r.json())
      );
      setLiveQueueData(data);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCreateDependent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepName) return;
    try {
      await recordsApi.createDependent({
        fullName: newDepName,
        relationship: newDepRel,
      });
      setNewDepName('');
      loadDependents();
      setNotificationMsg('Family member profile created successfully.');
      setTimeout(() => setNotificationMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to add family member');
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('category', uploadCategory);
    formData.append('description', uploadDesc);
    if (selectedDependentId) formData.append('dependentId', selectedDependentId);

    try {
      await recordsApi.uploadDocument(formData);
      setUploadFile(null);
      setUploadDesc('');
      loadRecords();
      setNotificationMsg('Medical report uploaded securely.');
      setTimeout(() => setNotificationMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Opriva Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 flex items-center justify-center pointer-events-none">
          <img src="/logo.png" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Hospital OP Registration &amp; Live Queue</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('tagline')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('discoverHospitalsDesc') || 'Discover verified nearby hospitals, choose your OP card with verified pricing, pay securely, and track your live turn from anywhere.'}
          </p>
          
          {/* Dependent Profile Selector Banner */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-teal-200 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Booking For:</span>
            </span>
            <select
              value={selectedDependentId}
              onChange={(e) => setSelectedDependentId(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-xs font-medium rounded-xl px-3 py-1.5 outline-hidden focus:ring-2 focus:ring-teal-400"
            >
              <option value="" className="text-slate-800">Primary: {user?.fullName || 'Self'}</option>
              {dependents.map(dep => (
                <option key={dep.id} value={dep.id} className="text-slate-800">
                  {dep.fullName} ({dep.relationship})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {notificationMsg && (
        <div className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-teal-600" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-6 text-sm font-semibold">
        <button
          onClick={() => setSubTab('hospitals')}
          className={`pb-3 transition flex items-center gap-2 shrink-0 ${
            subTab === 'hospitals'
              ? 'border-b-2 border-teal-600 text-teal-800 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Discover Hospitals</span>
        </button>

        <button
          onClick={() => setSubTab('queue')}
          className={`pb-3 transition flex items-center gap-2 shrink-0 ${
            subTab === 'queue'
              ? 'border-b-2 border-teal-600 text-teal-800 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-teal-600" />
          <span>Live Queue Status</span>
        </button>

        <button
          onClick={() => setSubTab('records')}
          className={`pb-3 transition flex items-center gap-2 shrink-0 ${
            subTab === 'records'
              ? 'border-b-2 border-teal-600 text-teal-800 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Medical Reports</span>
        </button>

        <button
          onClick={() => setSubTab('prescriptions')}
          className={`pb-3 transition flex items-center gap-2 shrink-0 ${
            subTab === 'prescriptions'
              ? 'border-b-2 border-teal-600 text-teal-800 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Prescriptions &amp; Visits</span>
        </button>

        <button
          onClick={() => setSubTab('dependents')}
          className={`pb-3 transition flex items-center gap-2 shrink-0 ${
            subTab === 'dependents'
              ? 'border-b-2 border-teal-600 text-teal-800 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Family Profiles</span>
        </button>
      </div>

      {/* TAB 1: HOSPITAL DISCOVERY & CARD SELECTION */}
      {subTab === 'hospitals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Hospital Search & List */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  loadHospitals(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 outline-hidden bg-white shadow-xs"
              />
            </div>

            {/* Hospital Cards */}
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {loading ? (
                <div className="p-8 text-center text-slate-400 text-xs">Loading verified hospitals...</div>
              ) : hospitals.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">No verified hospitals match your query.</div>
              ) : (
                hospitals.map((hosp) => (
                  <div
                    key={hosp.id}
                    onClick={() => setSelectedHospital(hosp)}
                    className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                      selectedHospital?.id === hosp.id
                        ? 'border-teal-500 bg-teal-50/40 shadow-sm ring-1 ring-teal-500'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-base">{hosp.name}</h4>
                          {hosp.verified && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-bold">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{hosp.locality}, {hosp.city}</span>
                        </p>
                      </div>

                      {/* Distance Badge */}
                      {hosp.distanceKm != null && (
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                          {hosp.distanceKm} km
                        </span>
                      )}
                    </div>

                    {/* Google Ratings and Review Count */}
                    <div className="mt-3 flex items-center gap-3 text-xs">
                      {hosp.googleRating ? (
                        <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-amber-800 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{hosp.googleRating}</span>
                          <span className="text-slate-400 font-normal">({hosp.googleReviewCount} reviews)</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Rating not available</span>
                      )}
                      
                      <div className="text-[11px] text-slate-400">
                        {hosp.ratingAttribution}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Right Column: Hospital Details & Card Selection */}
          <div className="lg:col-span-7">
            {selectedHospital ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                
                {/* Hospital Header Details */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{selectedHospital.name}</h2>
                      <p className="text-xs text-slate-600 mt-1">{selectedHospital.address}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-400 font-medium">Official OP Identifier</span>
                      <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md mt-0.5">
                        {selectedHospital.officialRegistrationNumber || 'Not provided'}
                      </span>
                    </div>
                  </div>

                  {/* Contact Receptionist Pill */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a
                      href={`tel:${selectedHospital.receptionistPhone}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold hover:bg-teal-100 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>OP Reception: {selectedHospital.receptionistPhone || 'Unavailable'}</span>
                    </a>
                    <span className="text-xs text-slate-400">Tap to call reception desk</span>
                  </div>
                </div>

                {/* Consultation Window Selection */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Select Consultation Slot Window</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['09:00 - 10:00 AM', '10:00 - 11:00 AM', '11:00 - 12:00 PM', '02:00 - 03:00 PM', '03:00 - 04:00 PM'].map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlotTime(slot)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                          selectedSlotTime === slot
                            ? 'border-teal-500 bg-teal-600 text-white shadow-xs'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* OP Card Tier Selection (Normal vs Special Priority) */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Select OP Registration Card</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedHospital.availableRegistrationTypes?.map((card: any) => {
                      const isSpecial = card.typeCode === 'SPECIAL';
                      return (
                        <div
                          key={card.id}
                          className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                            isSpecial
                              ? 'border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-teal-50/30'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          {isSpecial && (
                            <span className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
                              Priority Queue
                            </span>
                          )}

                          <div className="space-y-2">
                            <h4 className="font-bold text-slate-900 text-base">{card.displayName}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{card.description}</p>
                            <div className="text-2xl font-extrabold text-slate-900 font-mono pt-1">
                              ₹{Number(card.feeAmount).toFixed(2)}
                              <span className="text-xs font-normal text-slate-500 ml-1">{card.currency}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleInitiateReservation(card.id)}
                            className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm ${
                              isSpecial
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                : 'bg-teal-600 hover:bg-teal-700 text-white'
                            }`}
                          >
                            <span>Reserve &amp; Pay Online</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t('paymentVerifiedNotice')}</span>
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 text-slate-400 text-sm">
                Select a hospital from the list to view verified OP registration options.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: LIVE QUEUE STATUS */}
      {subTab === 'queue' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Hospital OP Smart Queue</span>
                <h3 className="text-xl font-black text-slate-900">{liveQueueData?.hospitalName || 'Apollo Health City'}</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live STOMP Sync</span>
              </span>
            </div>

            {/* Highlighted Token Display */}
            <div className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6 rounded-2xl border border-teal-200 text-center space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Queue Token</span>
              <div className="text-5xl font-black text-teal-900 font-mono tracking-tight animate-soft-pulse">
                {confirmedBooking?.tokenNumber || liveQueueData?.tokenNumber || 'N-102'}
              </div>
              <p className="text-xs font-mono font-semibold text-slate-500">
                Reg No: {confirmedBooking?.opRegistrationNumber || liveQueueData?.opRegistrationNumber || 'OPR-2026-HYD-004'}
              </p>
            </div>

            {/* Queue Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-medium">Currently Calling</span>
                <span className="text-lg font-black text-indigo-700 font-mono block mt-1">
                  {liveQueueData?.currentTokenBeingCalled || 'S-202'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-medium">Patients Ahead</span>
                <span className="text-lg font-black text-slate-800 font-mono block mt-1">
                  {liveQueueData?.patientsAhead != null ? liveQueueData.patientsAhead : 1}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-medium">Est. Wait Time</span>
                <span className="text-lg font-black text-teal-700 font-mono block mt-1">
                  ~{liveQueueData?.estimatedWaitingMinutes || 8} mins
                </span>
              </div>
            </div>

            {/* Receptionist Contact & Action */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-teal-600" />
                <span className="font-semibold text-slate-700">Need help? OP Desk: +91-40-2360-7777</span>
              </div>

              {confirmedBooking && (
                <button
                  onClick={() => setSelectedReceipt({
                    receiptNumber: confirmedBooking.digitalReceiptNumber,
                    opRegistrationNumber: confirmedBooking.opRegistrationNumber,
                    tokenNumber: confirmedBooking.tokenNumber,
                    hospitalName: confirmedBooking.hospitalName,
                    patientName: confirmedBooking.patientName,
                    registrationTypeName: confirmedBooking.registrationType,
                    feePaid: confirmedBooking.feePaid,
                    currency: confirmedBooking.currency,
                    paymentReference: 'Verified Online Payment',
                    issuedAt: confirmedBooking.confirmedAt,
                  })}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-2xs"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View Digital Receipt</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: MEDICAL REPORTS UPLOAD & STORAGE */}
      {subTab === 'records' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Upload Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-600" />
              <span>Upload Medical Document</span>
            </h3>
            <p className="text-xs text-slate-500">
              Securely store previous lab tests, scan reports, or discharge summaries (PDF, JPG, PNG).
            </p>

            <form onSubmit={handleUploadDocument} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Select File (Max 15MB)</label>
                <input
                  type="file"
                  accept=".pdf,image/jpeg,image/png"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Document Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="LAB_REPORT">Lab Blood / Pathology Report</option>
                  <option value="SCAN">Radiology / X-Ray / MRI Scan</option>
                  <option value="PRESCRIPTION">Previous Prescription</option>
                  <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
                  <option value="OTHER">Other Medical Document</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Description / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Lipid profile test"
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={!uploadFile}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition disabled:opacity-50"
              >
                Upload to Private Storage
              </button>
            </form>
          </div>

          {/* Document List */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-base font-bold text-slate-900">Your Medical Reports</h3>
            {records.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
                No medical documents uploaded yet.
              </div>
            ) : (
              records.map(doc => (
                <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{doc.fileName}</h4>
                      <p className="text-slate-500">{doc.documentCategory} • {(doc.fileSize / 1024).toFixed(1)} KB</p>
                      <span className="text-[10px] text-teal-700 font-medium">Owner: {doc.ownerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={doc.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition flex items-center gap-1"
                    >
                      <span>Download</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB 4: PRESCRIPTIONS & VISITS */}
      {subTab === 'prescriptions' && (
        <div className="space-y-4 max-w-3xl mx-auto">
          <h3 className="text-base font-bold text-slate-900">Hospital Consultation History</h3>
          {visits.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
              No completed hospital visit records found.
            </div>
          ) : (
            visits.map(visit => (
              <div key={visit.id} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-teal-700">{visit.consultationDate}</span>
                    <h4 className="text-lg font-bold text-slate-900">{visit.hospitalName}</h4>
                    <p className="text-xs text-slate-600">Consultant: {visit.clinicianName} ({visit.clinicianRegistrationNo})</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    {visit.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-700 block">Diagnosis:</span>
                  <p className="text-slate-600">{visit.diagnosisSummary || 'General consultation'}</p>
                </div>

                {/* Prescription details if present */}
                {visit.prescription && (
                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-teal-800">Prescription: {visit.prescription.prescriptionNumber}</span>
                      <span className="font-mono text-[10px] text-slate-400">Sig: {visit.prescription.digitalSignatureHash?.substring(0, 16)}...</span>
                    </div>

                    <div className="space-y-1.5">
                      {visit.prescription.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between p-2 rounded-lg bg-teal-50/50 text-slate-700">
                          <span className="font-semibold">{item.medicineName} ({item.dosage})</span>
                          <span>{item.frequency} • {item.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: FAMILY MEMBER PROFILES */}
      {subTab === 'dependents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Dependent Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-teal-600" />
              <span>Add Family Member</span>
            </h3>
            <p className="text-xs text-slate-500">
              Manage family member profiles with completely isolated medical histories.
            </p>

            <form onSubmit={handleCreateDependent} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Suman Reddy"
                  value={newDepName}
                  onChange={(e) => setNewDepName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Relationship</label>
                <select
                  value={newDepRel}
                  onChange={(e) => setNewDepRel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="Child">Child</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Other">Other Dependent</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition"
              >
                Save Family Profile
              </button>
            </form>
          </div>

          {/* Dependents List */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-base font-bold text-slate-900">Registered Dependents</h3>
            {dependents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
                No family dependents added yet.
              </div>
            ) : (
              dependents.map(dep => (
                <div key={dep.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{dep.fullName}</h4>
                    <p className="text-slate-500 font-medium">{dep.relationship} • Blood Group: {dep.bloodGroup || 'Not set'}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                    Authorized Dependent
                  </span>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* Payment Checkout Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        reservation={reservationData}
        onSuccess={handlePaymentSuccess}
      />

      {/* Digital Receipt Modal */}
      <DigitalReceiptModal
        isOpen={selectedReceipt !== null}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
      />

    </div>
  );
};
