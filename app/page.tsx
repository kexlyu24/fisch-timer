// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  // Kita pakai <any> biar TypeScript tidak rewel saat data awalnya null
  const [timerData, setTimerData] = useState<any>(null);
  const [nextEventDate, setNextEventDate] = useState<any>(null);
  const [status, setStatus] = useState('LOADING');

  // --- LOGIC (SAMA SEPERTI SEBELUMNYA) ---
  const INTERVAL_HOURS = 2;
  const DURATION_MINUTES = 15;

  const calculateState = () => {
    const now = new Date();
    const anchor = new Date();
    anchor.setUTCHours(0, 0, 0, 0);
    if (anchor.getTime() > now.getTime()) {
      anchor.setUTCDate(anchor.getUTCDate() - 1);
    }

    const intervalMs = INTERVAL_HOURS * 60 * 60 * 1000;
    const durationMs = DURATION_MINUTES * 60 * 1000;
    const timeSinceAnchor = now.getTime() - anchor.getTime();
    const cyclePosition = timeSinceAnchor % intervalMs;

    let currentStatus = 'WAITING';
    let targetTime = 0;
    let nextStartTime = 0;

    if (cyclePosition < durationMs) {
      currentStatus = 'ACTIVE';
      const currentCycleStart = now.getTime() - cyclePosition;
      targetTime = currentCycleStart + durationMs;
      nextStartTime = currentCycleStart + intervalMs;
    } else {
      currentStatus = 'WAITING';
      const currentCycleStart = now.getTime() - cyclePosition;
      targetTime = currentCycleStart + intervalMs;
      nextStartTime = targetTime;
    }

    const difference = targetTime - now.getTime();

    return {
      status: currentStatus,
      nextEventTimestamp: nextStartTime,
      total: difference,
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    const data = calculateState();
    setTimerData(data);
    setNextEventDate(new Date(data.nextEventTimestamp));
    setStatus(data.status);

    const timer = setInterval(() => {
      const data = calculateState();
      setTimerData(data);
      setNextEventDate(new Date(data.nextEventTimestamp));
      setStatus(data.status);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Kita beri tipe 'any' pada parameter agar tidak error implicit type
  const formatTimeForZone = (date: any, zone: any) => {
    if (!date) return "--:--";
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: zone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };

  if (!timerData || !nextEventDate) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse font-mono text-xs md:text-base">Syncing...</div>
      </main>
    );
  }

  const isActive = status === 'ACTIVE';
  const themeColor = isActive ? 'text-pink-500' : 'text-cyan-400';
  const glowColor = isActive ? 'shadow-[0_0_30px_#ec4899]' : 'shadow-2xl';
  const bgColor = isActive ? 'bg-pink-900/20' : 'bg-slate-900/60';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-slate-950 text-white font-sans px-4">

      {/* Background Ambience */}
      <div className="absolute inset-0 w-full h-full -z-10 transition-all duration-1000">
        <div className={`absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full blur-[80px] md:blur-[120px] animate-pulse ${isActive ? 'bg-pink-600/30' : 'bg-blue-700/20'}`}></div>
        <div className={`absolute bottom-[-20%] right-[20%] w-[60%] h-[60%] rounded-full blur-[80px] md:blur-[120px] animate-pulse delay-1000 ${isActive ? 'bg-red-600/30' : 'bg-purple-700/20'}`}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="z-10 w-full max-w-3xl flex flex-col items-center">

        {/* HEADER */}
        <div className="text-center mb-6 md:mb-10 scale-90 md:scale-100 transition-transform">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            LOVESTORM
          </h1>
          <div className="flex flex-col items-center gap-1 mt-1 md:mt-2">
            <span className={`${themeColor} tracking-[0.3em] text-[10px] md:text-xs font-bold uppercase transition-colors duration-500`}>
              Fisch Event Timer
            </span>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className={`mb-6 px-4 py-1.5 md:px-6 md:py-2 rounded-full font-bold tracking-widest text-[10px] sm:text-xs md:text-sm border transition-all duration-500 flex items-center gap-2 whitespace-nowrap
            ${isActive ? 'bg-pink-500 text-white border-pink-400 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'}
        `}>
          <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isActive ? 'bg-white' : 'bg-slate-500'}`}></span>
          {isActive ? 'EVENT ACTIVE' : 'WAITING FOR STORM'}
        </div>

        {/* MAIN TIMER BOX */}
        <div className={`
          w-full mb-8 md:mb-12 p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border backdrop-blur-md
          flex flex-col items-center justify-center transition-all duration-500
          ${bgColor} ${isActive ? 'border-pink-500' : 'border-white/10'} ${glowColor}
        `}>
          <p className={`text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 md:mb-4 font-bold ${isActive ? 'text-pink-200' : 'text-slate-500'}`}>
            {isActive ? 'EVENT ENDS IN:' : 'NEXT EVENT IN:'}
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 w-full max-w-lg text-center font-mono items-center">
            {/* JAM */}
            <div className={isActive ? 'opacity-30' : 'opacity-100'}>
              <div className="text-4xl sm:text-6xl md:text-8xl font-bold leading-none">{String(timerData.hours).padStart(2, '0')}</div>
              <div className="text-[8px] sm:text-[10px] uppercase text-slate-500 mt-1 md:mt-2 tracking-widest">Jam</div>
            </div>

            {/* TITIK DUA */}
            <div className="text-3xl sm:text-5xl md:text-7xl font-bold text-slate-600 animate-pulse pb-2">:</div>

            {/* MENIT */}
            <div className={isActive ? 'text-pink-400' : 'text-white'}>
              <div className="text-4xl sm:text-6xl md:text-8xl font-bold leading-none">{String(timerData.minutes).padStart(2, '0')}</div>
              <div className="text-[8px] sm:text-[10px] uppercase text-slate-500 mt-1 md:mt-2 tracking-widest">Menit</div>
            </div>
          </div>

          {/* SECONDS BAR */}
          <div className={`mt-4 md:mt-6 flex items-center gap-2 px-3 py-1 md:px-4 md:py-1 rounded-full border transition-colors duration-500 ${isActive ? 'bg-pink-950/50 border-pink-500/30' : 'bg-black/30 border-white/5'}`}>
            <span className={`font-mono font-bold text-base md:text-xl w-[24px] md:w-[30px] text-center ${themeColor}`}>
              {String(timerData.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] md:text-xs text-slate-400 uppercase">Detik</span>
          </div>
        </div>

        {/* JADWAL PER WILAYAH */}
        <div className="w-full">
          <p className="text-center text-slate-400 text-[10px] md:text-sm mb-3 md:mb-4 uppercase tracking-wider">
            {isActive ? 'Jadwal Berikutnya:' : 'Jadwal Mulai:'}
          </p>

          <div className="grid grid-cols-3 gap-2 md:gap-4">

            {/* WIB */}
            <div className="bg-slate-800/40 border border-slate-700 p-2 md:p-4 rounded-lg md:rounded-xl text-center flex flex-col justify-center items-center">
              <div className="text-[10px] md:text-xs text-slate-500 font-bold mb-0.5 md:mb-1">WIB</div>
              <div className={`text-lg sm:text-2xl md:text-3xl font-bold text-white group-hover:${themeColor} transition-colors`}>
                {formatTimeForZone(nextEventDate, 'Asia/Jakarta')}
              </div>
            </div>

            {/* WITA */}
            <div className="bg-slate-800/40 border border-cyan-500/30 p-2 md:p-4 rounded-lg md:rounded-xl text-center relative overflow-hidden flex flex-col justify-center items-center shadow-[0_0_10px_rgba(6,182,212,0.1)]">
              <div className={`absolute top-0 left-0 w-full h-1 ${isActive ? 'bg-pink-500' : 'bg-cyan-500'}`}></div>
              <div className={`text-[10px] md:text-xs font-bold mb-0.5 md:mb-1 ${isActive ? 'text-pink-400' : 'text-cyan-400'}`}>WITA</div>
              <div className={`text-lg sm:text-2xl md:text-3xl font-bold text-white group-hover:${themeColor} transition-colors`}>
                {formatTimeForZone(nextEventDate, 'Asia/Makassar')}
              </div>
            </div>

            {/* WIT */}
            <div className="bg-slate-800/40 border border-slate-700 p-2 md:p-4 rounded-lg md:rounded-xl text-center flex flex-col justify-center items-center">
              <div className="text-[10px] md:text-xs text-slate-500 font-bold mb-0.5 md:mb-1">WIT</div>
              <div className={`text-lg sm:text-2xl md:text-3xl font-bold text-white group-hover:${themeColor} transition-colors`}>
                {formatTimeForZone(nextEventDate, 'Asia/Jayapura')}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-8 md:mt-12 text-slate-600 text-[8px] md:text-[10px] text-center max-w-xs">
          Auto Sync • Responsive Layout
        </div>

      </div>
    </main>
  );
}