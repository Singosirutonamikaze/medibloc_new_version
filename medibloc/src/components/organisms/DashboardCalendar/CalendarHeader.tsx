import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4A90E2]/10 text-[#4A90E2] border border-[#4A90E2]/20">
          <FaCalendarAlt size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">Calendrier</h2>
          <p className="text-xs text-slate-400 font-medium">Gestion des rendez-vous</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors"
          title="Mois précédent"
        >
          <FaChevronLeft size={14} />
        </button>
        <span className="min-w-[120px] text-center font-bold text-slate-100 tracking-wide">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={onNextMonth}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors"
          title="Mois suivant"
        >
          <FaChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
