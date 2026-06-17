import { 
  FaTimes, 
  FaBirthdayCake, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaClipboardList, 
  FaCalendarAlt, 
  FaPaperclip 
} from "react-icons/fa";
import type { MedicalRecord } from "../../../types";
import { FILE_BASE_URL } from "../../../utils/api/api";

export interface MedicalRecordDetailsModalProps {
  readonly record: MedicalRecord;
  readonly onClose: () => void;
}

// Define getAgeText outside the component to keep rendering pure according to static analysis
const getAgeText = (birthDate?: string): string => {
  if (!birthDate) return "Non renseigné";
  const bd = new Date(birthDate);
  const ageDifMs = Date.now() - bd.getTime();
  if (Number.isNaN(ageDifMs)) {
    return "Date invalide";
  }
  const age = Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
  return `${bd.toLocaleDateString("fr-FR")} (${age} ans)`;
};

export function MedicalRecordDetailsModal({
  record,
  onClose,
}: Readonly<MedicalRecordDetailsModalProps>) {
  const p = record.patient;
  const u = p?.user;

  let genderText = "Non précisé";
  if (p?.gender === "MALE") {
    genderText = "Masculin";
  } else if (p?.gender === "FEMALE") {
    genderText = "Féminin";
  }

  const ageText = getAgeText(p?.birthDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button 
        type="button"
        className="absolute inset-0 w-full h-full bg-slate-955/80 backdrop-blur-sm transition-opacity border-none outline-none cursor-default"
        onClick={onClose}
        aria-label="Fermer le modal"
      />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-750 shadow-2xl rounded-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-slate-700/50 px-6 py-4 bg-slate-800/30">
          <h3 className="text-lg font-bold text-white tracking-wide">Détails du Dossier Clinique</h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300">
          {/* Patient Header */}
          <div className="pb-4 border-b border-slate-700/50 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-850 shrink-0">
              {u?.avatarUrl ? (
                <img 
                  src={u.avatarUrl.startsWith("http") ? u.avatarUrl : `${FILE_BASE_URL}${u.avatarUrl}`} 
                  alt="Avatar" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xl font-bold text-slate-500 uppercase">
                  {u?.firstName?.[0] || "P"}
                </div>
              )}
            </div>
            <div className="flex flex-col items-start">
              <h2 className="text-xl font-bold text-white leading-tight">
                {u ? `${u.firstName} ${u.lastName}` : `Patient #${record.patientId}`}
              </h2>
              <span className="text-slate-400 text-sm mt-1">
                Genre: {genderText}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-700/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-800 rounded text-slate-400 shrink-0 mt-0.5"><FaBirthdayCake /></div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Naissance</p>
                <p className="text-sm font-medium text-white">{ageText}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-800 rounded text-slate-400 shrink-0 mt-0.5"><FaPhoneAlt /></div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Téléphone</p>
                <p className="text-sm font-medium text-white">{p?.phone || "Non renseigné"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <div className="p-2 bg-slate-800 rounded text-slate-400 shrink-0 mt-0.5"><FaMapMarkerAlt /></div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Adresse</p>
                <p className="text-sm font-medium text-white leading-relaxed">{p?.address || "Aucune adresse enregistrée."}</p>
              </div>
            </div>
          </div>

          {/* Observations and attachments */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
                <FaClipboardList />
              </div>
              <h3 className="font-bold text-base">{record.title}</h3>
            </div>
            
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Compte-rendu Clinique</p>
              <div className="text-sm font-medium text-slate-200 whitespace-pre-wrap leading-relaxed">
                {record.content}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FaCalendarAlt />
              <span>Dernière mise à jour le {new Date(record.createdAt).toLocaleString("fr-FR")}</span>
            </div>

            {record.files && record.files.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-700/50">
                <p className="text-xs font-semibold text-slate-400">Documents attachés :</p>
                <div className="flex flex-wrap gap-2">
                  {record.files.map((file, idx) => (
                    <a
                      key={file}
                      href={file.startsWith("http") ? file : `${FILE_BASE_URL}${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <FaPaperclip size={10} />
                      Document #{idx + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
