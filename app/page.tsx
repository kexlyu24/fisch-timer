'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [nextEventDate, setNextEventDate] = useState(null);
  const [isEventActive, setIsEventActive] = useState(false);
  const [userTimeZone, setUserTimeZone] = useState('');

  // === KONFIGURASI PENTING ===
  const INTERVAL_HOURS = 3;

  // FIX: Kita geser 1 jam agar sesuai laporanmu 
  // (Target: 05:00 WIB / 06:00 WITA = 22:00 UTC)
  // Pola UTC sekarang jadi: 1, 4, 7, 10, 13, 16, 19, 22
  const OFFSET_HOURS = 1;

  const calculateTimeLeft = () => {
    const now = new Date();

    // Set Anchor ke jam 01:00 UTC hari ini (bukan 00:00)
    const anchor = new Date();
    anchor.setUTCHours(OFFSET_HOURS, 0, 0, 0);

    // Jika anchor jadi masa lalu (karena offset), kurangi 1 interval biar hitungan benar
    // Ini jaga-jaga kalau offsetnya bikin anchor lompat ke besok
    if (anchor.getTime() > now.getTime()) {
      anchor.setTime(anchor.getTime() - (INTERVAL_HOURS * 60 * 60 * 1000));
    }

    const intervalMs = INTERVAL_HOURS * 60 * 60 * 1000;

    // Cari waktu event selanjutnya
    let nextEventTime = anchor.getTime();
    while (nextEventTime <= now.getTime()) {
      nextEventTime += intervalMs;
    }

    const difference = nextEventTime - now.getTime();

    return {
      nextEventTimestamp: nextEventTime,
      total: difference,
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    setUserTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    const initialData = calculateTimeLeft();
    setTimeLeft(initialData);
    setNextEventDate(new Date(initialData.nextEventTimestamp));

    const timer = setInterval(() => {
      const tl = calculateTimeLeft();
      setTimeLeft(tl);
      setNextEventDate(new Date(tl.nextEventTimestamp));

      if (tl.total < 10000 && tl.total > 0) {
        setIsEventActive(true);
      } else {
        setIsEventActive(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft || !nextEventDate) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
        <div className="animate-pulse">Loading Timezone...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-slate-950 text-white">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="z-10 text-center px-4 w-full max-w-md mx-auto">
        <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
          FISCH TIMER
        </h1>

        <p className="text-slate-500 text-xs mb-8 uppercase tracking-widest border border-slate-800 rounded-full py-1 px-3 inline-block bg-slate-900/50">
          Zona Waktu: {userTimeZone.replace('_', ' ')}
        </p>

        <div className={`
          relative p-8 rounded-2xl border transition-all duration-500
          ${isEventActive
            ? 'bg-pink-500/10 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]'
            : 'bg-slate-900/50 border-slate-800 shadow-xl'}
        `}>
          <div className="flex justify-center items-end gap-2 font-mono text-white">
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-500 mt-2 uppercase">Jam</span>
            </div>
            <span className="text-4xl text-slate-600 mb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-500 mt-2 uppercase">Menit</span>
            </div>
            <span className="text-4xl text-slate-600 mb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold leading-none w-[80px]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-500 mt-2 uppercase">Detik</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Event Selanjutnya:</p>
          <div className="flex justify-center items-baseline gap-2">
            <p className="text-3xl font-bold text-cyan-400">
              {/* JAM AKAN OTOMATIS MENYESUAIKAN HP USER */}
              {nextEventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm text-slate-500 font-bold">
              {new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2] || 'Lokal'}
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {nextEventDate.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
        </div>

        {/* Info Tambahan untuk Debugging user */}
        <div className="mt-4 text-[10px] text-slate-600">
          Jadwal disinkronkan Global (UTC+1 Base)
        </div>

      </div>
    </main>
  );
}