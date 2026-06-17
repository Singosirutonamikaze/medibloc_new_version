import type { MedicalRecord } from "../../../types";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaPaperclip,
} from "react-icons/fa";
import { FILE_BASE_URL } from "../../../utils/api/api";

export interface MedicalRecordCardProps {
  readonly record: MedicalRecord;
  readonly onEdit: (record: MedicalRecord) => void;
  readonly onDelete: (record: MedicalRecord) => void;
  readonly onViewDetails: (record: MedicalRecord) => void;
}

export function MedicalRecordCard({
  record,
  onEdit,
  onDelete,
  onViewDetails,
}: Readonly<MedicalRecordCardProps>) {
  const u = record.patient?.user;
  const fallbackInitials = u?.firstName?.[0]?.toUpperCase() ?? "P";
  const dateFormatted = new Date(record.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-950/30 group flex flex-col justify-between h-full gap-4 relative">
      <div className="absolute top-5 right-5 inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-800/40 border border-slate-750 px-2.5 py-1 rounded-full font-semibold">
        <FaPaperclip size={10} className="text-slate-400" />
        <span>{record.files?.length || 0}</span>
      </div>

      <div className="space-y-4">
        {/* Patient Profile */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
            {u?.avatarUrl ? (
              <img
                src={
                  u.avatarUrl.startsWith("http")
                    ? u.avatarUrl
                    : `${FILE_BASE_URL}${u.avatarUrl}`
                }
                alt={`${u.firstName} ${u.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400 uppercase bg-slate-850">
                {fallbackInitials}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-white truncate">
              {u
                ? `${u.firstName} ${u.lastName}`
                : `Patient #${record.patientId}`}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <FaCalendarAlt size={10} className="text-slate-500" />
              <span className="truncate">{dateFormatted}</span>
            </div>
          </div>
        </div>

        {/* Record Content */}
        <div className="space-y-1.5 pt-1">
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {record.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
            {record.content || "Aucune observation clinique enregistrée."}
          </p>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-end gap-2">
        <button
          onClick={() => onViewDetails(record)}
          title="Voir les détails"
          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-500/20"
        >
          <FaEye size={14} />
        </button>
        <button
          onClick={() => onEdit(record)}
          title="Modifier"
          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent hover:border-emerald-500/20"
        >
          <FaEdit size={14} />
        </button>
        <button
          onClick={() => onDelete(record)}
          title="Supprimer"
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
        >
          <FaTrash size={12} />
        </button>
      </div>
    </div>
  );
}
