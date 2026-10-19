import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, MessageSquare } from 'lucide-react';

interface DigitalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: {
    receiptNumber: string;
    opRegistrationNumber: string;
    tokenNumber: string;
    hospitalName: string;
    patientName: string;
    registrationTypeName: string;
    feePaid: number;
    currency: string;
    paymentReference: string;
    issuedAt: string;
  } | null;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt,
}) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🏥 *${receipt.hospitalName} - Opriva OP Token*\n\n` +
      `🎫 *Token:* ${receipt.tokenNumber}\n` +
      `👤 *Patient:* ${receipt.patientName}\n` +
      `🏷️ *Category:* ${receipt.registrationTypeName}\n` +
      `📋 *OP Reg No:* ${receipt.opRegistrationNumber}\n` +
      `💳 *Fee Paid:* ₹${receipt.feePaid}\n\n` +
      `⚡ *Live Queue Tracking:* https://opriva.in/q/${receipt.tokenNumber}\n` +
      `_Healthcare, Without the Wait._`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-base">Verified OP Digital Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6" id="printable-receipt">
          
          {/* Header Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-200">
            <div className="flex items-center space-x-2.5">
              <img src="/logo.png" alt="Opriva" className="w-8 h-8 object-contain" />
              <div>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight">Opriva</span>
                <p className="text-[10px] text-teal-700 font-medium">Healthcare, Without the Wait.</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500">Receipt No:</span>
              <p className="text-xs font-mono font-bold text-slate-800">{receipt.receiptNumber}</p>
            </div>
          </div>

          {/* Token Highlight Banner */}
          <div className="bg-gradient-to-r from-teal-50 via-teal-100/50 to-emerald-50 p-4 rounded-xl border border-teal-200 text-center">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">OP Queue Token</span>
            <div className="text-4xl font-extrabold text-teal-900 my-1 font-mono tracking-tight">
              {receipt.tokenNumber}
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-teal-700 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Outpatient Registration</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Hospital</span>
              <span className="text-slate-800 font-bold text-sm block">{receipt.hospitalName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Patient Name</span>
              <span className="text-slate-800 font-bold text-sm block">{receipt.patientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">OP Registration Number</span>
              <span className="text-slate-800 font-mono font-semibold block">{receipt.opRegistrationNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Card Tier</span>
              <span className="text-slate-800 font-semibold block">{receipt.registrationTypeName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Registration Fee Paid</span>
              <span className="text-emerald-700 font-bold text-base block font-mono">
                ₹{Number(receipt.feePaid).toFixed(2)} {receipt.currency}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Payment Reference</span>
              <span className="text-slate-700 font-mono text-[11px] block truncate">{receipt.paymentReference}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
            Issued at {new Date(receipt.issuedAt).toLocaleString('en-IN')}. Please present this digital token when called at the hospital OP consultation room.
          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send to WhatsApp</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Thermal Slip</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-sm"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
