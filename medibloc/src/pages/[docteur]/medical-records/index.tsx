import { useEffect, useState } from "react";
import { 
  useMedicalRecords, 
  usePatients, 
  useNotification 
} from "../../../hooks";
import type { MedicalRecord, Patient } from "../../../types";
import { 
  MedicalRecordCard, 
  MedicalRecordFormModal, 
  MedicalRecordDetailsModal 
} from "../../../components/organisms";
import { 
  FaSearch, 
  FaTimes, 
  FaPlus,
  FaFolderOpen,
  FaExclamationTriangle
} from "react-icons/fa";

export default function DoctorMedicalRecordsPage() {
  const { getAll, create, update, remove, loading: recordsLoading } = useMedicalRecords();
  const { getAll: getAllPatients, loading: patientsLoading } = usePatients();
  const { addNotification } = useNotification();

  const [records, setRecords] = useState<readonly MedicalRecord[]>([]);
  const [patients, setPatients] = useState<readonly Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formIsOpen, setFormIsOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<MedicalRecord | null>(null);

  const loading = recordsLoading || patientsLoading;

  const fetchData = async () => {
    try {
      const resRecords: any = await getAll();
      setRecords(Array.isArray(resRecords) ? resRecords : (resRecords?.data?.data || resRecords?.data || []));
      
      const resPatients: any = await getAllPatients();
      setPatients(Array.isArray(resPatients) ? resPatients : (resPatients?.data?.data || resPatients?.data || []));
    } catch (err) {
      console.error(err);
      addNotification("error", "Erreur lors du chargement des dossiers médicaux.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [getAll, getAllPatients]);

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;
    try {
      await remove(recordToDelete.id);
      addNotification("success", "Le dossier médical a été supprimé.");
      setRecordToDelete(null);
      fetchData();
    } catch (err) {
      console.error(err);
      addNotification("error", "Impossible de supprimer le dossier médical.");
    }
  };

  const openAddForm = () => {
    setEditingRecord(null);
    setFormIsOpen(true);
  };

  const openEditForm = (record: MedicalRecord) => {
    setEditingRecord(record);
    setFormIsOpen(true);
  };

  const handleFormSubmit = async (data: {
    readonly patientId: number;
    readonly title: string;
    readonly content: string;
    readonly files: readonly string[];
  }) => {
    try {
      if (editingRecord) {
        await update(editingRecord.id, {
          title: data.title,
          content: data.content,
          files: [...data.files],
        });
        addNotification("success", "Dossier médical modifié avec succès.");
      } else {
        await create({
          patientId: data.patientId,
          title: data.title,
          content: data.content,
          files: [...data.files],
        });
        addNotification("success", "Nouveau dossier médical créé.");
      }
      setFormIsOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      addNotification("error", "Erreur lors de la sauvegarde.");
    }
  };

  // Filter records based on search term
  const filteredRecords = records.filter((rec) => {
    const titleMatch = rec.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const contentMatch = rec.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const patientName = `${rec.patient?.user?.firstName ?? ""} ${rec.patient?.user?.lastName ?? ""}`.toLowerCase();
    const nameMatch = patientName.includes(searchTerm.toLowerCase());
    return titleMatch || contentMatch || nameMatch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dossiers Médicaux</h1>
          <p className="text-slate-400 text-sm mt-1">Consultez et complétez les dossiers et suivis cliniques des patients.</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/10"
        >
          <FaPlus size={12} />
          Nouveau Dossier
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 max-w-md focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all duration-200">
        <FaSearch className="text-slate-500 mr-3" />
        <input
          type="text"
          placeholder="Rechercher par patient, titre ou contenu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-white border-none focus:outline-none text-sm placeholder-slate-500"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="text-slate-500 hover:text-slate-300">
            <FaTimes size={12} />
          </button>
        )}
      </div>

      {/* Grid of Medical Records */}
      {loading && filteredRecords.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 h-48 animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-800 rounded w-1/3" />
                  <div className="h-2 bg-slate-800 rounded w-1/4" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-5/6" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-900/10 border border-slate-800/60 rounded-2xl">
          <FaFolderOpen size={48} className="mb-4 text-slate-700/50" />
          <p className="font-semibold text-slate-400">Aucun dossier médical trouvé</p>
          <p className="text-sm text-slate-500 mt-1">Créez un nouveau dossier ou modifiez vos termes de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {filteredRecords.map((record) => (
            <MedicalRecordCard
              key={record.id}
              record={record}
              onEdit={openEditForm}
              onDelete={setRecordToDelete}
              onViewDetails={setViewingRecord}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {formIsOpen && (
        <MedicalRecordFormModal
          record={editingRecord}
          patients={patients}
          onClose={() => setFormIsOpen(false)}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      )}

      {/* Details Modal */}
      {viewingRecord && (
        <MedicalRecordDetailsModal
          record={viewingRecord}
          onClose={() => setViewingRecord(null)}
        />
      )}

      {/* Confirmation de suppression */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setRecordToDelete(null)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-750 shadow-2xl rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                <FaExclamationTriangle size={32} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Supprimer le Dossier</h3>
            <p className="text-slate-400 text-sm mb-6">
              Êtes-vous sûr de vouloir supprimer ce dossier clinique ? Cette action est définitive.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg font-medium transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors text-sm shadow-lg shadow-red-500/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
