import React, { useState, useEffect } from 'react';
import { X, Lock, CreditCard, Smartphone, Building, ShieldCheck, AlertCircle } from 'lucide-react';
import { bookingApi } from '../services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: {
    reservationId: string;
    hospitalName: string;
    registrationTypeName: string;
    patientName: string;
    sessionDate: string;
    slotTime: string;
    feeAmount: number;
    currency: string;
    expiresAt: string;
  } | null;
  onSuccess: (confirmation: any) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  reservation,
  onSuccess,
}) => {
  if (!isOpen || !reservation) return null;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('patient@okhdfcbank');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes default in seconds

  useEffect(() => {
    if (!reservation?.expiresAt) return;
    const expiryTime = new Date(reservation.expiresAt).getTime();

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setError('Slot reservation expired. Please select a new registration slot.');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [reservation]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleProcessPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create Server-side Payment Order
      const orderRes = await bookingApi.createPaymentOrder(reservation.reservationId);

      // 2. Simulate Payment Gateway processing & callback
      // Generating provider transaction reference
      const providerPaymentId = `pay_opriva_${Date.now()}`;
      const providerSignature = `sig_hmac_${Math.random().toString(36).substring(2, 12)}`;

      // 3. Server-side payment verification (mandatory before confirming slot)
      const confirmation = await bookingApi.verifyPayment({
        reservationId: reservation.reservationId,
        providerOrderId: orderRes.providerOrderId,
        providerPaymentId: providerPaymentId,
        providerSignature: providerSignature,
      });

      onSuccess(confirmation);
    } catch (err: any) {
      setError(err.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-sm">Secure OP Slot Payment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Reservation Expiry Countdown */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs">
            <span className="font-semibold text-amber-800">Temporary Slot Held:</span>
            <span className="font-mono font-bold text-amber-900 text-sm">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Booking Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Hospital:</span>
              <span className="font-semibold text-slate-800">{reservation.hospitalName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="font-semibold text-slate-800">{reservation.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">OP Card Tier:</span>
              <span className="font-semibold text-teal-700">{reservation.registrationTypeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Window:</span>
              <span className="font-semibold text-slate-800">{reservation.sessionDate} ({reservation.slotTime})</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-700">Total Registration Fee:</span>
              <span className="font-mono font-extrabold text-teal-700 text-base">
                ₹{Number(reservation.feeAmount).toFixed(2)} {reservation.currency}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Select Payment Mode</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex flex-col items-center p-3 rounded-xl border text-xs font-medium transition ${
                  paymentMethod === 'upi'
                    ? 'border-teal-500 bg-teal-50/50 text-teal-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1 text-teal-600" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center p-3 rounded-xl border text-xs font-medium transition ${
                  paymentMethod === 'card'
                    ? 'border-teal-500 bg-teal-50/50 text-teal-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1 text-sky-600" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex flex-col items-center p-3 rounded-xl border text-xs font-medium transition ${
                  paymentMethod === 'netbanking'
                    ? 'border-teal-500 bg-teal-50/50 text-teal-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building className="w-5 h-5 mb-1 text-indigo-600" />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          {/* UPI input mock */}
          {paymentMethod === 'upi' && (
            <div className="space-y-1 text-xs">
              <label className="text-slate-600 font-medium">Virtual Payment Address (VPA / UPI ID)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="name@bank"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-hidden font-mono"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 text-xs text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>End-to-end encrypted with server-side signature verification.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading || timeLeft <= 0}
            onClick={handleProcessPayment}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying with Server...</span>
              </>
            ) : (
              <span>Pay ₹{Number(reservation.feeAmount).toFixed(2)} &amp; Confirm</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
