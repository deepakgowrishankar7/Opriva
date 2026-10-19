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
  FileCheck
} from 'lucide-react';
import { queueApi, hospitalApi } from '../../services/api';
import { webSocketService } from '../../services/websocket';
import { DigitalReceiptModal } from '../../components/DigitalReceiptModal';

export const ReceptionistDashboard: React.FC = () => {
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

    return () => {
      webSocketService.disconnect();
    };
  }, [hospitalId, selectedDate]);

  const handleCallNext = async () => {
    try {
      const res = await queueApi.callNextToken(hospitalId);
      setFeedback(`Token ${res.tokenNumber} successfully called.`);
      fetchQueue();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'No patients waiting in queue');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[11px] font-bold">
              OP Receptionist Dashboard
            </span>
            <span className="text-xs text-slate-400">• Verified Hospital Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {overview?.hospitalName || 'Apollo Health City'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
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
            onClick={() => setIsWalkInOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Walk-in Patient</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-teal-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Registered</span>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{overview?.totalRegistrations || 0}</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <span className="text-xs text-amber-800 font-medium">Waiting Patients</span>
          <div className="text-2xl font-black text-amber-700 mt-1 font-mono">{overview?.waitingCount || 0}</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-teal-200 bg-teal-50/20 shadow-2xs">
          <span className="text-xs text-teal-800 font-medium">Called Tokens</span>
          <div className="text-2xl font-black text-teal-700 mt-1 font-mono">{overview?.calledCount || 0}</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-2xs">
          <span className="text-xs text-indigo-800 font-medium">In Consultation</span>
          <div className="text-2xl font-black text-indigo-700 mt-1 font-mono">{overview?.inConsultationCount || 0}</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <span className="text-xs text-emerald-800 font-medium">Completed</span>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">{overview?.completedCount || 0}</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">No-Show / Missed</span>
          <div className="text-2xl font-black text-slate-600 mt-1 font-mono">{overview?.noShowCount || 0}</div>
        </div>
      </div>

      {/* Action Bar: Call Next & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Call Next Button (Priority Tiers Respected) */}
        <button
          onClick={handleCallNext}
          className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-sm shadow-md transition"
        >
          <PhoneCall className="w-5 h-5" />
          <span>Call Next Eligible Patient</span>
        </button>

        {/* Live Token Status Pill */}
        <div className="flex items-center gap-4 text-xs font-semibold px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px]">Active Normal Token</span>
            <span className="text-slate-800 font-mono font-bold text-sm">{overview?.currentNormalToken || '-'}</span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-indigo-500 block text-[10px] font-bold">Active Special Priority</span>
            <span className="text-indigo-800 font-mono font-bold text-sm">{overview?.currentSpecialToken || '-'}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search token, name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-hidden"
          />
        </div>

      </div>

      {/* Live Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Today's Session Queue List</h3>
          <span className="text-xs text-slate-500">Auto-updating via WebSockets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">OP Reg No</th>
                <th className="px-4 py-3">Patient Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Card Tier</th>
                <th className="px-4 py-3">Current State</th>
                <th className="px-4 py-3 text-right">Queue Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No registrations found for this session.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item: any) => {
                  const isSpecial = item.priorityWeight > 1;
                  return (
                    <tr key={item.tokenId} className="hover:bg-slate-50/80 transition">
                      
                      <td className="px-4 py-3 font-mono font-extrabold text-sm text-slate-900">
                        <span className={`inline-block px-2 py-0.5 rounded-md ${
                          isSpecial ? 'bg-indigo-100 text-indigo-900' : 'bg-teal-100 text-teal-900'
                        }`}>
                          {item.tokenNumber}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-600 font-semibold">
                        {item.opRegistrationNumber}
                      </td>

                      <td className="px-4 py-3 font-bold text-slate-800">
                        {item.patientName}
                      </td>

                      <td className="px-4 py-3 text-slate-500 font-mono">
                        {item.patientPhone}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold ${isSpecial ? 'text-indigo-700' : 'text-slate-600'}`}>
                          {item.registrationTypeName}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.queueState === 'WAITING' ? 'bg-amber-100 text-amber-800' :
                          item.queueState === 'CALLED' ? 'bg-teal-100 text-teal-800 animate-pulse' :
                          item.queueState === 'IN_CONSULTATION' ? 'bg-indigo-100 text-indigo-800' :
                          item.queueState === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          item.queueState === 'NO_SHOW' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {item.queueState}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {item.queueState === 'WAITING' && (
                            <button
                              onClick={() => handleUpdateState(item.tokenId, 'CALLED', 'Called by receptionist')}
                              className="px-2.5 py-1 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold transition"
                            >
                              Call
                            </button>
                          )}

                          {item.queueState === 'CALLED' && (
                            <button
                              onClick={() => handleUpdateState(item.tokenId, 'IN_CONSULTATION', 'Patient entered room')}
                              className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition"
                            >
                              Start Consult
                            </button>
                          )}

                          {item.queueState === 'IN_CONSULTATION' && (
                            <button
                              onClick={() => handleUpdateState(item.tokenId, 'COMPLETED', 'Consultation finished')}
                              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition"
                            >
                              Complete
                            </button>
                          )}

                          {(item.queueState === 'WAITING' || item.queueState === 'CALLED') && (
                            <button
                              onClick={() => handleUpdateState(item.tokenId, 'NO_SHOW', 'Patient did not respond to call')}
                              className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold transition"
                            >
                              No-Show
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
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-xs"
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
