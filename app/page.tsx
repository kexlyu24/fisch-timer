'use client';

import { useState, useEffect } from 'react';

interface TimeLeft {
  total: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isEventActive, setIsEventActive] = useState(false);

  const INTERVAL_HOURS = 3;

  const calculateTimeLeft = () => {
    const now = new Date();

    const anchor = new Date();
    anchor.setHours(0, 0, 0, 0);

    const intervalMs = INTERVAL_HOURS * 60 * 60 * 1000;

    let nextEventTime = anchor.getTime();
    while (nextEventTime <= now.getTime()) {
      nextEventTime += intervalMs;
    }

    const difference = nextEventTime - now.getTime();


    return {
      total: difference,
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const tl = calculateTimeLeft();
      setTimeLeft(tl);

      if (tl.total < 10000 && tl.total > 0) {
        setIsEventActive(true);
      } else {
        setIsEventActive(false);
      }

    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
        <h1>Loading Fisch Timer...</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-slate-950 text-white selection:bg-pink-500 selection:text-white">

      {/* Background Effect (Aurora/Storm vibes) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-400 to-purple-400">
          FISCH LOVESTORM
        </h1>

        <p className="text-slate-400 text-lg mb-12 font-medium tracking-widest uppercase">
          Next Event Countdown
        </p>

        {/* Timer Box */}
        <div className={`
          relative group p-8 md:p-12 rounded-3xl border 
          backdrop-blur-xl transition-all duration-500
          ${isEventActive
            ? 'bg-pink-500/10 border-pink-500 shadow-[0_0_50px_rgba(236,72,153,0.5)]'
            : 'bg-white/5 border-white/10 shadow-2xl'}
        `}>
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">

            {/* Hours */}
            <div className="flex flex-col">
              <span className="text-5xl md:text-8xl font-black font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-xs md:text-sm text-slate-400 uppercase mt-2">Jam</span>
            </div>

            {/* Separator */}
            <div className="text-5xl md:text-8xl font-black font-mono text-slate-600 animate-pulse">:</div>

            {/* Minutes */}
            <div className="flex flex-col">
              <span className="text-5xl md:text-8xl font-black font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-xs md:text-sm text-slate-400 uppercase mt-2">Menit</span>
            </div>
          </div>

          {/* Seconds (Floating below or integrated) */}
          <div className="mt-8 text-center">
            <span className={`text-2xl md:text-3xl font-mono font-bold ${isEventActive ? 'text-pink-400' : 'text-slate-500'}`}>
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-600 ml-2">DETIK</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-slate-500 text-sm">
          <p>Timer resets every 3 hours automatically.</p>
          <p className="mt-2 text-xs opacity-50">Local Time Sync</p>
        </div>
      </div>
    </main>
  );
}