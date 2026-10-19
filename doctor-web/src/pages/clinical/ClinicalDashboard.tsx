import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  FileText, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  CheckCircle, 
  ExternalLink,
  Lock,
  UserCheck
} from 'lucide-react';
import { recordsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ClinicalDashboard: React.FC = () => {
  const { user } = useAuth();

  // Search state
  const [patientIdInput, setPatientIdInput] = useState('usr-pat-001'); // Ananya Reddy default
  const [patientName, setPatientName] = useState('Ananya Reddy');
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [patientReports, setPatientReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Prescription builder state
  const [diagnosisSummary, setDiagnosisSummary] = useState('Acute Upper Respiratory Tract Infection (URTI)');
  const [clinicalNotes, setClinicalNotes] = useState('Throat congestion observed. Vital signs stable.');
  const [instructions, setInstructions] = useState('Take medications after meals with warm water. Rest for 3 days.');
  const [items, setItems] = useState([
    { medicineName: 'Amoxicillin 500mg', dosage: '1 tablet', frequency: 'Three times a day (TDS)', duration: '5 days', specialInstructions: 'After food' },
    { medicineName: 'Paracetamol 650mg', dosage: '1 tablet', frequency: 'Twice daily or SOS', duration: '3 days', specialInstructions: 'For fever/body ache' },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('1 tablet');
  const [newMedFreq, setNewMedFreq] = useState('Twice daily (BD)');
  const [newMedDuration, setNewMedDuration] = useState('5 days');

  const [createdPrescription, setCreatedPrescription] = useState<any | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSearchPatient = async () => {
    setLoading(true);
    try {
      const [visits, docs] = await Promise.all([
        recordsApi.getVisitTimeline({ patientId: patientIdInput }),
        recordsApi.getDocuments({ patientId: patientIdInput }),
      ]);
      setPatientHistory(visits);
      setPatientReports(docs);
      setFeedback('Patient records loaded with authorized consent.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error loading clinical records');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = () => {
    if (!newMedName) return;
    setItems([
      ...items,
      {
        medicineName: newMedName,
        dosage: newMedDosage,
        frequency: newMedFreq,
        duration: newMedDuration,
        specialInstructions: 'After food',
      },
    ]);
    setNewMedName('');
  };

  const handleRemoveMedicine = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSignPrescription = async () => {
    if (items.length === 0) {
      alert('Please add at least one medication to the prescription.');
      return;
    }
    setLoading(true);
    try {
      const res = await recordsApi.createPrescription({
        hospitalId: 'hosp-001',
        patientId: patientIdInput,
        clinicianName: user?.fullName || 'Dr. Rajesh Sharma, MD',
        clinicianLicenseNo: 'KMC-REG-2014-9988',
        diagnosisSummary: diagnosisSummary,
        clinicalNotes: clinicalNotes,
        instructions: instructions,
        items: items,
      });

      setCreatedPrescription(res);
      setFeedback(`Prescription ${res.prescriptionNumber} authenticated and digitally signed!`);
      // Refresh timeline
      handleSearchPatient();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to create digital prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[11px] font-bold">
              Restricted Clinical Record Interface
            </span>
            <span className="text-xs text-slate-400">• Doctor / Clinician Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Patient Consultation &amp; Digital Prescriptions
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
          <UserCheck className="w-4 h-4 text-teal-600" />
          <span>Clinician: {user?.fullName || 'Dr. Rajesh Sharma, MD'}</span>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-teal-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Patient Search & Lookup */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-600" />
          <span>Authorized Patient Record Lookup</span>
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter Patient ID, Phone or Registration Number..."
            value={patientIdInput}
            onChange={(e) => setPatientIdInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
          <button
            onClick={handleSearchPatient}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Load Authorized Records</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Clinical History on Left, Prescription Builder on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Patient Reports & Timeline */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Patient Reports */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Patient Uploaded Reports ({patientReports.length})</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Consent Granted</span>
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {patientReports.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No reports shared by patient.</p>
              ) : (
                patientReports.map(doc => (
                  <div key={doc.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800">{doc.fileName}</h4>
                      <p className="text-[11px] text-slate-500">{doc.documentCategory} • {(doc.fileSize / 1024).toFixed(1)} KB</p>
                    </div>
                    <a
                      href={doc.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                      title="View Report"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Visit History */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Historical Visit Records ({patientHistory.length})</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {patientHistory.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No prior visit records recorded.</p>
              ) : (
                patientHistory.map(v => (
                  <div key={v.id} className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{v.hospitalName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{v.consultationDate}</span>
                    </div>
                    <p className="text-slate-600">{v.diagnosisSummary}</p>
                    {v.prescription && (
                      <span className="inline-block text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-bold">
                        Rx: {v.prescription.prescriptionNumber}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Digital Prescription Generator */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Generate Verified Digital Prescription</h3>
              <p className="text-xs text-slate-500">Prescription information is signed cryptographically upon submission.</p>
            </div>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 text-xs">
            
            <div>
              <label className="font-bold text-slate-700 block mb-1">Clinical Diagnosis Summary</label>
              <input
                type="text"
                value={diagnosisSummary}
                onChange={(e) => setDiagnosisSummary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Clinical Notes (Confidential)</label>
              <textarea
                rows={2}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            {/* Medicines List */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-800 block text-xs">Prescribed Medicines &amp; Dosages</span>
              
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900 block">{item.medicineName}</span>
                      <span className="text-slate-500 text-[11px]">{item.dosage} • {item.frequency} • {item.duration}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(idx)}
                      className="p-1 rounded-md text-slate-400 hover:text-red-600 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Medicine Row */}
              <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">Add Medication</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Medicine & strength"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    className="sm:col-span-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Patient Instructions / Follow-up Advice</label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            {/* Cryptographic Signature Disclaimer */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
              <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                By clicking authenticate, this prescription will be timestamped, cryptographically hashed with SHA-256, and permanently attached to the patient's record.
              </span>
            </div>

            {/* Action */}
            <button
              onClick={handleSignPrescription}
              disabled={loading || items.length === 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-black text-xs shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Authenticating & Signing...' : 'Sign & Issue Digital Prescription'}
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
