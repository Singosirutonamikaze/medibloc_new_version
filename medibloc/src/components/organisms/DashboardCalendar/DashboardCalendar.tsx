import { useState, useEffect, useMemo } from 'react';
import { useAppointments } from '../../../hooks';
import type { Appointment } from '../../../types';
import { CalendarHeader } from './CalendarHeader';
import { CalendarDayCell } from './CalendarDayCell';
import { AppointmentModal } from './AppointmentModal';

const DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];


// --- Main Dashboard Component ---

export default function DashboardCalendar() {
  const { getAll, loading, error } = useAppointments();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    let mounted = true;

    getAll({ limit: 1000 })
      .then((res) => {
        if (!mounted) return;
        // Safely extract the array. The backend may return PaginatedResponse (res.data is the array)
        // or a different shape (e.g., res.data.data).
        const rawData = res?.data;
        let safeArray: Appointment[] = [];

        if (Array.isArray(rawData)) {
          safeArray = rawData;
        } else if (rawData && typeof rawData === 'object' && 'data' in rawData && Array.isArray((rawData as any).data)) {
          safeArray = (rawData as any).data;
        } else if (Array.isArray(res)) {
          safeArray = res as any; // Fallback if res is an array directly
        }

        setAppointments(safeArray);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("Erreur lors du chargement des rendez-vous:", err);
      });

    return () => {
      mounted = false;
    };
  }, [getAll]);

  // Transform data safely
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();

    // Extra safety check before iterating
    if (!Array.isArray(appointments)) return map;

    appointments.forEach((apt) => {
      if (!apt?.scheduledAt) return;
      const dateObj = new Date(apt.scheduledAt);
      if (isNaN(dateObj.getTime())) return;

      const dateStr = dateObj.toISOString().split("T")[0];
      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }
      map.get(dateStr)!.push(apt);
    });

    return map;
  }, [appointments]);

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Mon = 0, Sun = 6

  const isToday = (dateStr: string) => {
    return new Date().toISOString().split("T")[0] === dateStr;
  };

  const selectedAppointments = selectedDateStr ? (appointmentsByDate.get(selectedDateStr) || []) : [];

  return (
    <div className="w-full bg-linear-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden relative">
      <div className="h-1 w-full bg-linear-to-r from-[#4A90E2] via-[#2ECC71] to-[#4A90E2]" />
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={() => setCurrentDate(new Date(year, month - 1, 1))}
        onNextMonth={() => setCurrentDate(new Date(year, month + 1, 1))}
      />

      <div className="p-6">
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-[#4A90E2]"></div>
          </div>
        ) : error ? (
          <div className="h-96 flex flex-col items-center justify-center text-[#E74C3C] gap-2">
            <p className="font-semibold">Impossible de charger le calendrier</p>
            <span className="text-sm text-slate-400">{error}</span>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-7 gap-2 mb-3">
              {DAYS.map((day) => (
                <div key={day} className="text-center font-bold text-slate-400 text-xs uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {/* Empty padding days */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-28 rounded-xl border border-transparent bg-slate-800/30"></div>
              ))}

              {/* Actual days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateObj = new Date(year, month, day);
                const dateStr = dateObj.toISOString().split("T")[0];
                const dayAppointments = appointmentsByDate.get(dateStr) || [];

                return (
                  <CalendarDayCell
                    key={day}
                    day={day}
                    dateStr={dateStr}
                    appointments={dayAppointments}
                    isToday={isToday(dateStr)}
                    onSelectDate={setSelectedDateStr}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedDateStr && (
        <AppointmentModal
          dateStr={selectedDateStr}
          appointments={selectedAppointments}
          onClose={() => setSelectedDateStr(null)}
        />
      )}
    </div>
  );
}
