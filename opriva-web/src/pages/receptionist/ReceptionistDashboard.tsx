import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  PhoneCall, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  UserPlus, 
  RefreshCw, 
  Calendar, 
  ShieldCheck,
  Search,
  Receipt,
  FileCheck,
  Volume2,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { queueApi, hospitalApi } from '../../services/api';
import { webSocketService } from '../../services/websocket';
import { DigitalReceiptModal } from '../../components/DigitalReceiptModal';
import { useLanguage } from '../../context/LanguageContext';

export const ReceptionistDashboard: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [hospitalId, setHospitalId] = useState('hosp-001'); // Apollo Jubilee Hills default
  const [overview, setOverview] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Walk-in modal state
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInCardTypeId, setWalkInCardTypeId] = useState('type-001');
  const [walkInPaymentMode, setWalkInPaymentMode] = useState('CASH_COUNTER');

  // Notification feedback
  const [feedback, setFeedback] = useState<string | null>(null);

  // Play audio chime and voice announcement
  const playChimeAndVoice = (tokenNumber: string, counterName: string) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);

      if ('speechSynthesis' in window) {
        setTimeout(() => {
          const langCode = currentLanguage === 'te' ? 'te-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
          const utter = new SpeechSynthesisUtterance(`Token ${tokenNumber}, please proceed to ${counterName}`);
          utter.rate = 0.9;
          utter.lang = langCode;
          window.speechSynthesis.speak(utter);
        }, 700);
      }
    } catch (e) {
      // ignore
    }
  };

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await queueApi.getReceptionistOverview(hospitalId, selectedDate);
      setOverview(data);
    } catch (err: any) {
      console.error('Failed to load queue overview', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();

    // Connect WebSocket STOMP for live queue broadcast updates
    webSocketService.connect(() => {
      webSocketService.subscribeHospitalQueue(hospitalId, () => {
        fetchQueue();
      });
    });

    // Auto poll every 3 seconds for reliable sync
    const interval = setInterval(fetchQueue, 3000);

    return () => {
      clearInterval(interval);
      webSocketService.disconnect();
    };
  }, [hospitalId, selectedDate]);

  // Handle Call Next Eligible Patient
  const handleCallNext = async () => {
    const waitingTokens = overview?.queueList?.filter((t: any) => t.queueState === 'WAITING') || [];
    if (waitingTokens.length === 0) {
      setFeedback('No patients currently waiting. Click "+ Add 3 Waiting Patients" to populate the queue.');
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    try {
      const res = await queueApi.callNextToken(hospitalId);
      playChimeAndVoice(res.tokenNumber, 'Room 102 (Dr. Rajesh Sharma)');
      setFeedback(`Token ${res.tokenNumber} successfully called! Audio announcement broadcast.`);
      fetchQueue();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(err.message || 'Error calling patient');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  // Call a specific token directly
  const handleCallSpecific = async (tokenId: string, tokenNumber: string) => {
    try {
      await queueApi.updateTokenState(tokenId, 'CALLED', 'Called by receptionist desk');
      playChimeAndVoice(tokenNumber, 'Room 102 (Dr. Rajesh Sharma)');
      setFeedback(`Token ${tokenNumber} called!`);
      fetchQueue();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to call token');
    }
  };

  const handleUpdateState = async (tokenId: string, targetState: string, reason?: string) => {
    try {
      await queueApi.updateTokenState(tokenId, targetState, reason || 'Receptionist queue management');
      fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Failed to update token state');
    }
  };

  // Add 3 sample waiting patients for easy testing
  const handleAddSampleWaiting = async () => {
    setLoading(true);
    try {
      // If there are completed or in-consultation tokens, reset them to WAITING
      const queue: any[] = overview?.queueList || [];
      const nonWaiting = queue.filter(t => t.queueState !== 'WAITING');
      
      if (nonWaiting.length >= 2) {
        for (let i = 0; i < Math.min(3, nonWaiting.length); i++) {
          await queueApi.updateTokenState(nonWaiting[i].tokenId, 'WAITING', 'Reset to waiting queue for demo');
        }
      } else {
        // Register walk-in patients
        const samples = [
          { name: 'Kavita Rao', phone: '9848011223', card: 'type-002' },
          { name: 'Rahul Varma', phone: '9848044556', card: 'type-001' },
          { name: 'Deepak Gowri', phone: '9848077889', card: 'type-001' }
        ];
        for (const s of samples) {
          await queueApi.registerWalkIn({
            patientName: s.name,
            patientPhone: s.phone,
            hospitalId: hospitalId,
            opRegistrationTypeId: s.card,
            paymentMethod: 'CASH_COUNTER'
          });
        }
      }
      setFeedback('Added active waiting patients to the queue! Ready to call.');
      fetchQueue();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await queueApi.registerWalkIn({
        patientName: walkInName,
        patientPhone: walkInPhone,
        hospitalId: hospitalId,
        opRegistrationTypeId: walkInCardTypeId,
        paymentMethod: walkInPaymentMode,
      });

      setIsWalkInOpen(false);
      setWalkInName('');
      setWalkInPhone('');
      setFeedback(`Walk-in confirmed! Issued Token: ${res.tokenNumber}`);
      fetchQueue();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Walk-in registration failed');
    }
  };

  const filteredQueue = overview?.queueList?.filter((t: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.tokenNumber?.toLowerCase().includes(q) ||
      t.opRegistrationNumber?.toLowerCase().includes(q) ||
      t.patientName?.toLowerCase().includes(q) ||
      t.patientPhone?.includes(q)
    );
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[11px] font-bold">
              {t('receptionDashboard', 'OP Receptionist Dashboard')}
            </span>
            <span className="text-xs text-slate-400">• Apollo Health City (Jubilee Hills)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {overview?.hospitalName || 'Apollo Health City'}
          </h1>
        </div>

        <div className="flex items-center space-x-2.5">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white shadow-2xs"
          />
          <button
            onClick={fetchQueue}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title="Refresh Queue"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
          </button>
          
          <button
            onClick={handleAddSampleWaiting}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-300 cursor-pointer"
            title="Add waiting patients to test queue calling"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('btnAddSample', '+ Add 3 Waiting Patients')}</span>
          </button>

          <button
            onClick={() => setIsWalkInOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('walkInPatient', 'Walk-in Patient')}</span>
          </button>
        </div>
      </div>

      {/* Alert Feedback Banner */}
      {feedback && (
        <div className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">
            {t('totalRegistered', 'Total Registered')}
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            {overview?.totalRegistrations || filteredQueue.length}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-amber-300 bg-amber-50/30 shadow-2xs">
          <span className="text-xs text-amber-800 font-bold block">
            {t('waitingPatients', 'Waiting Patients')}
          </span>
          <div className="text-2xl font-black text-amber-700 mt-1 font-mono">
            {overview?.waitingCount || filteredQueue.filter((t: any) => t.queueState === 'WAITING').length}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-teal-300 bg-teal-50/30 shadow-2xs">
          <span className="text-xs text-teal-800 font-bold block">
            {t('calledTokens', 'Called Tokens')}
          </span>
          <div className="text-2xl font-black text-teal-700 mt-1 font-mono">
            {overview?.calledCount || filteredQueue.filter((t: any) => t.queueState === 'CALLED').length}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-indigo-300 bg-indigo-50/30 shadow-2xs">
          <span className="text-xs text-indigo-800 font-bold block">
            {t('inConsultation', 'In Consultation')}
          </span>
          <div className="text-2xl font-black text-indigo-700 mt-1 font-mono">
            {overview?.inConsultationCount || filteredQueue.filter((t: any) => t.queueState === 'IN_CONSULTATION').length}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-300 bg-emerald-50/30 shadow-2xs">
          <span className="text-xs text-emerald-800 font-bold block">
            {t('completed', 'Completed')}
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
            {overview?.completedCount || filteredQueue.filter((t: any) => t.queueState === 'COMPLETED').length}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">
            {t('noShow', 'No-Show / Missed')}
          </span>
          <div className="text-2xl font-black text-slate-600 mt-1 font-mono">
            {overview?.noShowCount || 0}
          </div>
        </div>

      </div>

      {/* Action Bar: Call Next & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Call Next Button (Calls Priority Special Cards First, Then Normal) */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCallNext}
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-sm shadow-md transition cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('callNextEligible', 'Call Next Eligible Patient')}</span>
          </button>
        </div>

        {/* Live Token Status Pill */}
        <div className="flex items-center gap-4 text-xs font-semibold px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px]">{t('activeNormal', 'Active Normal Token')}</span>
            <span className="text-slate-800 font-mono font-bold text-sm">{overview?.currentNormalToken || '-'}</span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-indigo-600 block text-[10px] font-bold">{t('activeSpecial', 'Active Special Priority')}</span>
            <span className="text-indigo-700 font-mono font-extrabold text-sm">{overview?.currentSpecialToken || '-'}</span>
          </div>
        </div>

      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              {t('todaysQueue', "Today's Session Queue List")}
            </h2>
            <span className="text-[11px] text-slate-500">Live synchronized with Room 102 & Waiting Hall TV</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('searchQueue', 'Search token, name, phone...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">{t('colToken', 'TOKEN')}</th>
                <th className="px-4 py-3">{t('colRegNo', 'OP REG NO')}</th>
                <th className="px-4 py-3">{t('colPatient', 'PATIENT NAME')}</th>
                <th className="px-4 py-3">{t('colContact', 'CONTACT')}</th>
                <th className="px-4 py-3">{t('colCard', 'CARD TIER')}</th>
                <th className="px-4 py-3">{t('colState', 'CURRENT STATE')}</th>
                <th className="px-4 py-3 text-right">{t('colActions', 'QUEUE ACTIONS')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-xs">
                    No registrations found. Click "+ Add 3 Waiting Patients" to populate the session.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item: any) => {
                  const isSpecial = (item.registrationTypeName || item.typeDisplayName)?.toLowerCase().includes('special');
                  const cardTitle = isSpecial 
                    ? t('specialCard', 'Special Priority OP Card')
                    : t('normalCard', 'Normal OP Card');

                  return (
                    <tr key={item.tokenId} className="hover:bg-slate-50/80 transition">
                      
                      <td className="px-4 py-3.5 font-mono font-bold text-sm text-slate-900">
                        {item.tokenNumber}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-600 text-[11px]">
                        {item.opRegistrationNumber}
                      </td>

                      <td className="px-4 py-3.5 font-bold text-slate-800">
                        {item.patientName}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-500 text-[11px]">
                        {item.patientPhone}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isSpecial 
                            ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {cardTitle}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.queueState === 'WAITING' ? 'bg-amber-100 text-amber-800' :
                          item.queueState === 'CALLED' ? 'bg-teal-100 text-teal-800 animate-pulse' :
                          item.queueState === 'IN_CONSULTATION' ? 'bg-indigo-100 text-indigo-800' :
                          item.queueState === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {item.queueState === 'WAITING' ? t('statusWaiting', 'WAITING') :
                           item.queueState === 'CALLED' ? t('statusCalled', 'CALLED') :
                           item.queueState === 'IN_CONSULTATION' ? t('statusInConsultation', 'IN_CONSULTATION') :
                           item.queueState === 'COMPLETED' ? t('statusCompleted', 'COMPLETED') :
                           item.queueState}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          
                          {/* If WAITING: Allow Direct Call */}
                          {item.queueState === 'WAITING' && (
                            <button
                              onClick={() => handleCallSpecific(item.tokenId, item.tokenNumber)}
                              className="px-2.5 py-1 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>{t('btnCall', 'Call')}</span>
                            </button>
                          )}

                          {/* If CALLED: Allow Start Consult or Recall */}
                          {item.queueState === 'CALLED' && (
                            <>
                              <button
                                onClick={() => handleUpdateState(item.tokenId, 'IN_CONSULTATION', 'Patient entered room')}
                                className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition cursor-pointer"
                              >
                                {t('btnStartConsult', 'Start Consult')}
                              </button>
                              <button
                                onClick={() => playChimeAndVoice(item.tokenNumber, 'Room 102')}
                                className="px-2 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold transition cursor-pointer"
                                title="Repeat Voice Chime"
                              >
                                {t('btnRecall', 'Recall 🔁')}
                              </button>
                            </>
                          )}

                          {/* If IN_CONSULTATION: Complete */}
                          {item.queueState === 'IN_CONSULTATION' && (
                            <button
                              onClick={() => handleUpdateState(item.tokenId, 'COMPLETED', 'Consultation finished')}
                              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition cursor-pointer"
                            >
                              {t('btnComplete', 'Complete ✅')}
                            </button>
                          )}

                          {/* If COMPLETED: Allow Reset back to WAITING for testing */}
                          {item.queueState === 'COMPLETED' && (
                            <button
                              onClick={() => handleUpdateState(item.tokenId, 'WAITING', 'Reset to waiting queue for demo')}
                              className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition cursor-pointer"
                              title="Reset back to waiting queue"
                            >
                              {t('btnResetWaiting', 'Re-queue 🔄')}
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Walk-in Registration Modal */}
      {isWalkInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fadeIn">
            
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm">Register Walk-in Patient</h3>
              <button onClick={() => setIsWalkInOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Varma"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 9848012345"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">OP Card Tier</label>
                <select
                  value={walkInCardTypeId}
                  onChange={(e) => setWalkInCardTypeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="type-001">Normal OP Card — ₹350.00</option>
                  <option value="type-002">Special Priority OP Card — ₹750.00</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Counter Payment Mode</label>
                <select
                  value={walkInPaymentMode}
                  onChange={(e) => setWalkInPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden focus:ring-2 focus:ring-teal-500 bg-white font-semibold"
                >
                  <option value="CASH_COUNTER">Cash at Counter</option>
                  <option value="UPI_COUNTER">Counter UPI QR</option>
                  <option value="CARD_COUNTER">Counter POS Card</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsWalkInOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Confirm &amp; Issue Token
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      <DigitalReceiptModal
        isOpen={selectedReceipt !== null}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
      />

    </div>
  );
};
