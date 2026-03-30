import { useEffect, useState } from "react";
import { DataTable } from "../../../components/organisms/DataTable";
import type { ColumnDef } from "../../../components/organisms/DataTable/DataTable";
import { usePatients, useUsers, useNotification } from "../../../hooks";
import type { Patient, UpdatePatientDto } from "../../../types";
import { FaUserInjured, FaBirthdayCake, FaMapMarkerAlt, FaPhoneAlt, FaTimes } from "react-icons/fa";

export default function AdminPatientsPage() {
  const { getAll, loading: patientsLoading, remove, update } = usePatients();
  const { create: createUser, loading: usersLoading } = useUsers();
  const { addNotification } = useNotification();

  const [patients, setPatients] = useState<Patient[]>([]);

  const [formIsOpen, setFormIsOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const loading = patientsLoading || usersLoading;

  const fetchData = async () => {
    try {
      const resPat: any = await getAll();
      setPatients(Array.isArray(resPat) ? resPat : (resPat?.data?.data || resPat?.data || []));
    } catch (err) {
      console.error(err);
      addNotification('error', 'Erreur lors du chargement des dossiers.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [getAll]);

  const columns: ColumnDef<Patient>[] = [
    { header: "ID", accessorKey: "id", className: "w-16 font-medium text-slate-400" },
    {
      header: "Identité",
      render: (p) => (
        <span className="font-semibold text-white">
          {p.user?.firstName ? `${p.user.firstName} ${p.user.lastName}` : `Patient #${p.id}`}
        </span>
      )
    },
    {
      header: "Genre",
      render: (p) => <span className="text-slate-300">{p.gender === 'MALE' ? 'Masculin' : p.gender === 'FEMALE' ? 'Féminin' : 'N/C'}</span>
    },
    {
      header: "Âge",
      render: (p) => {
        if (!p.birthDate) return <span className="text-slate-500">—</span>;
        const bd = new Date(p.birthDate);
        const ageDifMs = Date.now() - bd.getTime();
        const age = Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
        return <span className="text-slate-300">{age} ans</span>;
      }
    },
    { header: "Téléphone", render: (p) => <span className="text-slate-400">{p.phone || '—'}</span> }
  ];

  const handleDelete = async (patient: Patient) => {
    try {
      await remove(patient.id);
      addNotification('success', "Le dossier patient a été supprimé.");
      fetchData();
    } catch (err) {
      console.error(err);
      addNotification('error', "Impossible de supprimer le dossier.");
    }
  };

  const openAddForm = () => {
    setEditingPatient(null);
    setFormIsOpen(true);
  };

  const openEditForm = (patient: Patient) => {
    setEditingPatient(patient);
    setFormIsOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingPatient) {
        await update(editingPatient.id, data as UpdatePatientDto);
        addNotification('success', "Dossier patient modifié avec succès.");
      } else {
        await createUser({
          ...data,
          role: 'PATIENT'
        });
        addNotification('success', "Nouveau patient créé.");
      }
      setFormIsOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      addNotification('error', "Erreur lors de la sauvegarde.");
    }
  };

  const getAge = (birthDate?: string) => {
    if (!birthDate) return 'Non renseigné';
    const bd = new Date(birthDate);
    const ageDifMs = Date.now() - bd.getTime();
    if (isNaN(ageDifMs)) return 'Date invalide';
    const age = Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
    return `${bd.toLocaleDateString('fr-FR')} (Âge: ${age} ans)`;
  }

  const renderPatientDetails = (p: Patient) => (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-700/50 flex flex-col items-start">
        <h2 className="text-xl font-bold text-white leading-tight">
          {p.user?.firstName ? `${p.user.firstName} ${p.user.lastName}` : `Dossier #${p.id}`}
        </h2>
        <span className="text-slate-400 text-sm mt-1">
          Sexe: {p.gender === 'MALE' ? 'Masculin' : p.gender === 'FEMALE' ? 'Féminin' : 'Non précisé'}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 text-slate-300">
          <div className="p-2 bg-slate-800 rounded text-slate-400 shrink-0"><FaBirthdayCake /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Naissance</p>
            <p className="text-sm font-medium text-white">{getAge(p.birthDate)}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 text-slate-300">
          <div className="p-2 bg-slate-800 rounded text-slate-400 shrink-0"><FaPhoneAlt /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Contact direct</p>
            <p className="text-sm font-medium text-white">{p.phone || 'Aucun numéro'}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 text-slate-300">
          <div className="p-2 bg-slate-800 rounded text-slate-400 shrink-0"><FaMapMarkerAlt /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Adresse de résidence</p>
            <p className="text-sm font-medium text-white leading-relaxed">{p.address || 'Aucune adresse enregistrée.'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Patients</h1>
          <p className="text-slate-400 text-sm mt-1">Archives et suivi réglementaire des patients du centre.</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-slate-700 hover:border-slate-500"
        >
          <FaUserInjured /> Nouveau Patient
        </button>
      </div>

      <DataTable
        data={patients}
        columns={columns}
        isLoading={loading}
        title="Liste exhaustive"
        emptyMessage="Aucun patient enregistré."
        keyExtractor={(item) => String(item.id)}
        onDelete={handleDelete}
        onEdit={openEditForm}
        renderDetails={renderPatientDetails}
      />

      {formIsOpen && (
        <PatientFormModal
          patient={editingPatient}
          onClose={() => setFormIsOpen(false)}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      )}
    </div>
  );
}

function PatientFormModal({ patient, onClose, onSubmit, loading }: { patient: Patient | null; onClose: () => void; onSubmit: (data: any) => void; loading: boolean }) {
  const defaultDate = patient?.birthDate ? new Date(patient.birthDate).toISOString().split('T')[0] : '';
  const isEditing = !!patient;

  const [formData, setFormData] = useState({
    firstName: patient?.user?.firstName || '',
    lastName: patient?.user?.lastName || '',
    email: patient?.user?.email || '',
    password: '',
    birthDate: defaultDate,
    gender: patient?.gender || '',
    phone: patient?.phone || '',
    address: patient?.address || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      onSubmit({
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
        gender: formData.gender as "MALE" | "FEMALE" | "OTHER",
        phone: formData.phone,
        address: formData.address
      });
    } else {
      onSubmit({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
        // role "PATIENT" is added via API call
      });
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-800/30">
          <h3 className="text-lg font-semibold text-white">
            {isEditing ? "Éditer un dossier patient" : "Nouveau compte patient"}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-700 transition">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isEditing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Prénom</label>
                  <input
                    required
                    type="text"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nom</label>
                  <input
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Adresse E-mail</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Mot d'accès initial</label>
                <input
                  required
                  type="text"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-xs text-slate-500 italic">Lors de la création, le compte utilisateur sera lié automatiquement à un dossier médical vide.</p>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Genre Biologique</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="" disabled>Choisir...</option>
                    <option value="MALE">Masculin</option>
                    <option value="FEMALE">Féminin</option>
                    <option value="OTHER">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Téléphone de Secours</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Adresse Complète</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-transparent border border-slate-700 rounded-lg hover:bg-slate-800 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-900 bg-white hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Chargement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
