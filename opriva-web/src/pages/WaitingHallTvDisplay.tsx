import React, { useState, useEffect } from 'react';
import { queueApi } from '../services/api';
import { webSocketService } from '../services/websocket';
import { Tv, Volume2, Clock, Users, Sparkles, Building2, ArrowLeft } from 'lucide-react';

interface WaitingHallTvDisplayProps {
  onBackToPortal?: () => void;
}

export const WaitingHallTvDisplay: React.FC<WaitingHallTvDisplayProps> = ({ onBackToPortal }) => {
  const [hospitalId] = useState('hosp-001'); // Apollo Jubilee Hills
  const [currentTime, setCurrentTime] = useState(new Date());
  const [overview, setOverview] = useState<any | null>(null);
  const [calledHistory, setCalledHistory] = useState<any[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play audio chime when token is called
  const playChimeAndVoice = (tokenNumber: string, counterName: string) => {
    if (!soundEnabled) return;
    try {
      // Pleasant chime audio via Web Audio API oscillator
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

      // Speech synthesis announcement
      if ('speechSynthesis' in window) {
        setTimeout(() => {
          const utter = new SpeechSynthesisUtterance(`Token ${tokenNumber}, please proceed to ${counterName}`);
          utter.rate = 0.9;
          window.speechSynthesis.speak(utter);
        }, 700);
      }
    } catch (e) {
      // ignore
    }
  };

  const fetchLiveStatus = async () => {
    try {
      const data = await queueApi.getReceptionistOverview(hospitalId);
      setOverview(data);

      const list: any[] = data.queueList || [];
      const called = list.filter((t: any) => t.queueState === 'CALLED');
      if (called.length > 0) {
        setCalledHistory(called);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 3000);
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    // WebSocket STOMP listener
    webSocketService.connect(() => {
      webSocketService.subscribeHospitalQueue(hospitalId, (update: any) => {
        fetchLiveStatus();
        const updateStr = typeof update === 'string' ? update : JSON.stringify(update);
        if (updateStr.includes('CALLED') || updateStr.includes('TOKEN_CALLED')) {
          const match = updateStr.match(/[A-Z]-\d+/);
          const tokenNum = match ? match[0] : '';
          playChimeAndVoice(tokenNum || 'Next Patient', 'Room 102 (Dr. Rajesh Sharma)');
        }
      });
    });

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  const tokens: any[] = overview?.queueList || [];

  const currentlyServing = tokens.find((t: any) => t.queueState === 'CALLED') 
    || tokens.find((t: any) => t.queueState === 'IN_CONSULTATION') 
    || (tokens.length > 0 ? tokens[0] : {
      tokenNumber: 'S-201',
      registrationTypeName: 'Special Priority OP Card',
      assignedCounter: 'Room 102 • Dr. Rajesh Sharma',
      patientName: 'Ananya Reddy',
    });

  const waitingTokens = tokens.filter((t: any) => t.queueState === 'WAITING');

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans select-none overflow-hidden">
      
      {/* High-Contrast TV Display Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-4">
          {onBackToPortal && (
            <button
              onClick={onBackToPortal}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Exit TV Mode to Staff Portal"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal</span>
            </button>
          )}

          <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center">
            <img src="/logo.png" alt="Opriva" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                Opriva
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping"></span>
              </h1>
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
                LIVE OPD QUEUE MONITOR
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium mt-0.5">
              Apollo Health City • Main Outpatient Waiting Lounge
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playChimeAndVoice('TEST', 'Room 102');
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border text-xs font-bold transition ${
              soundEnabled
                ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{soundEnabled ? 'Chime & Voice: ON' : 'Chime & Voice: MUTED'}</span>
          </button>

          <div className="text-right border-l border-slate-800 pl-6">
            <div className="text-2xl font-black font-mono text-white">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Waiting Hall Grid */}
      <div className="flex-1 p-8 grid grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column (7 cols): HUGE "NOW CALLING" SPOTLIGHT */}
        <div className="col-span-7 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-teal-950/60 rounded-3xl border-2 border-teal-500/40 p-10 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="px-4 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg">
                NOW CALLING / ప్రస్తుతం పిలుస్తున్నది
              </span>
              <span className="text-xs text-teal-300 font-bold">
                Please proceed immediately
              </span>
            </div>
            <Sparkles className="w-6 h-6 text-teal-400 animate-pulse" />
          </div>

          {/* Mammoth Token Display */}
          <div className="my-auto text-center py-6">
            <span className="text-teal-400 text-sm font-bold tracking-widest uppercase block mb-2">
              TOKEN NUMBER
            </span>
            <div className="text-[120px] sm:text-[140px] font-black tracking-tight font-mono text-white leading-none drop-shadow-2xl">
              {currentlyServing.tokenNumber}
            </div>

            <div className="inline-block mt-4 px-6 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-xl sm:text-2xl font-black text-teal-300">
                {currentlyServing.assignedCounter || 'ROOM 102 • DR. RAJESH SHARMA'}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-6 flex items-center justify-between text-slate-400 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-teal-400" />
              <span>Patient: <strong className="text-white">{currentlyServing.patientName || 'Private Consultation'}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-teal-400" />
              <span>Category: <strong className="text-teal-300">{currentlyServing.typeDisplayName || 'Priority OP'}</strong></span>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): UPCOMING QUEUE SEQUENCE */}
        <div className="col-span-5 flex flex-col bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
          
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Upcoming Queue Sequence
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Next patients in line for consultation
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
              {waitingTokens.length} Waiting
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {waitingTokens.slice(0, 6).map((item: any, idx: number) => {
              const cardName = item.registrationTypeName || item.typeDisplayName || 'Normal OP Card';
              const isSpecial = cardName.toLowerCase().includes('special');
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                    idx === 0
                      ? 'bg-slate-800/90 border-teal-500/50 shadow-md'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-700">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-2xl font-black font-mono text-white">
                        {item.tokenNumber}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {cardName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {isSpecial ? (
                      <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
                        Priority
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold">
                        ~{(idx + 1) * 8} mins
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Please watch this screen or check your phone app for live alerts.
          </div>

        </div>

      </div>

      {/* Footer Ticker Banner */}
      <footer className="bg-slate-900 border-t border-slate-800 px-8 py-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-teal-400" />
          <span>Opriva Smart Hospital Queue Network</span>
          <span>•</span>
          <span className="text-teal-300">Emergency cases take precedence over paid priority</span>
        </div>
        <div>
          OP Reception Help Desk: <strong className="text-white">+91-40-2360-7777</strong>
        </div>
      </footer>

    </div>
  );
};
