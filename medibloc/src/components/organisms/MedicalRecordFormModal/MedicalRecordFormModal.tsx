import { useState } from "react";
import { FaFileMedical, FaTimes } from "react-icons/fa";
import type { MedicalRecord, Patient } from "../../../types";

export interface MedicalRecordFormModalProps {
  readonly record: MedicalRecord | null;
  readonly patients: readonly Patient[];
  readonly onClose: () => void;
  readonly onSubmit: (data: {
    readonly patientId: number;
    readonly title: string;
    readonly content: string;
    readonly files: readonly string[];
  }) => void;
  readonly loading: boolean;
}

export function MedicalRecordFormModal({
  record,
  patients,
  onClose,
  onSubmit,
  loading,
}: Readonly<MedicalRecordFormModalProps>) {
  const isEditing = !!record;

  let submitButtonText = "Créer le dossier";
  if (loading) {
    submitButtonText = "Enregistrement...";
  } else if (isEditing) {
    submitButtonText = "Enregistrer les modifications";
  }

  const [formData, setFormData] = useState({
    patientId: record?.patientId ?? 0,
    title: record?.title ?? "",
    content: record?.content ?? "",
    filesInput: record?.files?.join(", ") ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientId = formData.patientId || (patients[0]?.id ?? 0);
    if (!patientId || patientId === 0) return;

    const files = formData.filesInput
      ? formData.filesInput.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    onSubmit({
      patientId: Number(patientId),
      title: formData.title,
      content: formData.content,
      files,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button 
        type="button"
        className="absolute inset-0 w-full h-full bg-slate-955/80 backdrop-blur-sm transition-opacity border-none outline-none cursor-default"
        onClick={onClose}
        aria-label="Fermer le modal"
      />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/50 shadow-2xl rounded-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-slate-700/50 px-6 py-4 bg-slate-800/30">
          <div className="flex items-center gap-2 text-white">
            <FaFileMedical className="text-emerald-500" />
            <h3 className="text-lg font-bold">
              {isEditing ? "Modifier le Dossier Médical" : "Créer un Dossier Médical"}
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label htmlFor="patient-select" className="block text-sm font-medium text-slate-300 mb-1">Sélectionner le Patient</label>
            <select
              id="patient-select"
              disabled={isEditing}
              value={formData.patientId || (patients[0]?.id ?? "")}
              onChange={(e) => setFormData({ ...formData, patientId: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-750 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.user ? `${p.user.firstName} ${p.user.lastName}` : `Patient #${p.id}`}
                </option>
              ))}
            </select>
            {isEditing && (
              <p className="text-xs text-slate-500 mt-1">Le patient associé ne peut pas être modifié.</p>
            )}
          </div>

          <div>
            <label htmlFor="record-title" className="block text-sm font-medium text-slate-300 mb-1">Titre de l'Observation</label>
            <input
              id="record-title"
              required
              type="text"
              placeholder="Ex: Consultation Générale, Examen Cardiologique..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-750 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="record-content" className="block text-sm font-medium text-slate-300 mb-1">Observations cliniques & Diagnostics</label>
            <textarea
              id="record-content"
              required
              rows={6}
              placeholder="Saisissez le compte-rendu clinique détaillé, les antécédents, le traitement préconisé..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-slate-800 border border-slate-750 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans"
            />
          </div>

          <div>
            <label htmlFor="record-files" className="block text-sm font-medium text-slate-300 mb-1">Documents et Pièces jointes (URLs séparées par des virgules)</label>
            <input
              id="record-files"
              type="text"
              placeholder="Ex: /uploads/docs/radio.jpg, http://example.com/analyses.pdf"
              value={formData.filesInput}
              onChange={(e) => setFormData({ ...formData, filesInput: e.target.value })}
              className="w-full bg-slate-800 border border-slate-750 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg font-medium transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              disabled={loading}
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors text-sm shadow-lg shadow-emerald-500/10 disabled:opacity-50"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
