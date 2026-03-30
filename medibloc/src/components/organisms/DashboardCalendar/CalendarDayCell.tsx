import type { Appointment } from '../../../types';

interface CalendarDayCellProps {
  day: number;
  dateStr: string;
  appointments: Appointment[];
  isToday: boolean;
  onSelectDate: (d: string) => void;
}

export function CalendarDayCell({ day, dateStr, appointments, isToday, onSelectDate }: CalendarDayCellProps) {
  const count = appointments.length;

  return (
    <div
      onClick={() => onSelectDate(dateStr)}
      className={`relative h-28 p-3 rounded-xl border transition-colors cursor-pointer flex flex-col items-start
        ${isToday
          ? 'border-[#4A90E2] bg-[#4A90E2]/10 shadow-[0_0_10px_rgba(74,144,226,0.1)]'
          : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/30'
        }
      `}
    >
      <span className={`text-sm font-semibold mb-1 ${isToday ? 'text-[#4A90E2]' : 'text-slate-300'}`}>
        {day}
      </span>

      {count > 0 && (
        <div className="w-full flex-1 flex flex-col gap-1 overflow-hidden mt-1">
          {appointments.slice(0, 2).map((apt) => {
            const time = new Date(apt.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            return (
              <div
                key={apt.id}
                className="w-full text-xs px-2 py-1 bg-slate-900/50 text-slate-200 rounded block truncate font-medium border border-slate-700/50"
              >
                {time} - {apt.patient?.user?.firstName || `Patient #${apt.patientId}`}
              </div>
            );
          })}
          {count > 2 && (
             <div className="text-[10px] text-slate-400 font-medium pl-1 mt-0.5">
                +{count - 2} autre{count > 3 ? 's' : ''}
             </div>
          )}
        </div>
      )}

      {count > 0 && (
        <div className="absolute top-2 right-2 flex items-center justify-center min-w-[20px] h-5 px-1 bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#2ECC71] text-[10px] font-bold rounded-full shadow-sm">
          {count}
        </div>
      )}
    </div>
  );
}
