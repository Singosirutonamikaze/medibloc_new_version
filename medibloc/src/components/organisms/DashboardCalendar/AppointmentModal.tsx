import { FaTimes, FaCalendarAlt, FaUserClock, FaStethoscope } from 'react-icons/fa';
import type { Appointment } from '../../../types';

interface AppointmentModalProps {
  dateStr: string;
  appointments: Appointment[];
  onClose: () => void;
}

export function AppointmentModal({ dateStr, appointments, onClose }: AppointmentModalProps) {
  return (
    <dialog
      open
      className="fixed inset-0 z-50 m-0 h-full w-full max-w-none border-none bg-transparent p-0"
    >
      <div
        className="absolute inset-0 w-full bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div className="pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col max-h-[85vh]">
          
          <div className="flex items-center justify-between border-b 0 border-slate-700/50 px-6 py-4 bg-slate-800/30">
            <div>
              <h3 className="text-lg font-bold text-white">Rendez-vous prévus</h3>
              <p className="text-sm text-slate-400">
                {new Date(dateStr).toLocaleDateString('fr-FR', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <FaCalendarAlt size={48} className="mb-4 text-slate-600/50" />
                <p className="font-medium text-slate-400">Aucun rendez-vous pour cette date.</p>
              </div>
            ) : (
              appointments.map((apt) => {
                const time = new Date(apt.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                
                const statusStyles: Record<string, string> = {
                  COMPLETED: 'bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20',
                  CANCELLED: 'bg-[#E74C3C]/10 text-[#E74C3C] border-[#E74C3C]/20',
                  CONFIRMED: 'bg-[#4A90E2]/10 text-[#4A90E2] border-[#4A90E2]/20',
                  PENDING: 'bg-[#F39C12]/10 text-[#F39C12] border-[#F39C12]/20'
                };
                
                const statusTheme = statusStyles[apt.status] || 'bg-slate-800 text-slate-300 border-slate-700';

                return (
                  <div key={apt.id} className="flex gap-4 p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 hover:shadow-lg transition-all group">
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-slate-900 border border-slate-700 text-slate-200 shrink-0 shadow-sm group-hover:border-[#4A90E2]/50 transition-colors">
                      <span className="text-sm font-bold">{time.replace(':', 'h')}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border ${statusTheme}`}>
                          {apt.status}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-slate-100 truncate flex items-center gap-2">
                        <FaUserClock className="text-slate-400" size={12} />
                        Patient #{apt.patientId}
                      </h4>
                      
                      {apt.reason && (
                        <p className="text-sm text-slate-400 mt-1">{apt.reason}</p>
                      )}
                      
                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <FaStethoscope className="text-slate-400" /> Médecin #{apt.doctorId}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
