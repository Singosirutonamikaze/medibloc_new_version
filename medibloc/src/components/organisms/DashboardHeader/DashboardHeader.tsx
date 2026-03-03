import { useEffect, useState } from 'react';
import { FiClock, FiCalendar } from 'react-icons/fi';
import logo from "../../../assets/logo/logo.png";

const formatTime = () =>
  new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

const formatDate = () =>
  new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(formatTime);
  const [currentDate] = useState(formatDate);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(formatTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl shadow-lg overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-[#3a7bd5] via-[#2ECC71] to-[#3a7bd5]" />

      <div className="flex items-center justify-between px-6 py-4">

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl bg-white p-2">
            <img src={logo} alt="Medibloc" className="h-9 w-auto object-contain" />
          </div>
          <div>
            <p className="text-xs text-gray-400 leading-none mt-0.5">
              Votre système de santé
            </p>
          </div>
        </div>

        <p className="hidden md:block text-sm text-gray-300 italic">
          Toujours à vos côtés, à chaque instant.
        </p>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300">
            <FiCalendar size={14} className="text-[#3a7bd5] shrink-0" />
            <span className="capitalize">{currentDate}</span>
          </div>

          <div className="hidden sm:block h-6 w-px bg-gray-600" />

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2ECC71] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2ECC71]" />
            </span>
            <FiClock size={14} className="text-[#2ECC71]" />
            <span className="font-mono text-sm font-semibold tracking-widest text-[#2ECC71]">
              {currentTime}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardHeader;
