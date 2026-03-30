import { useEffect, useState } from "react";
import { DataTable } from "../../../components/organisms/DataTable";
import type { ColumnDef } from "../../../components/organisms/DataTable/DataTable";
import { useDoctors, useUsers, useNotification } from "../../../hooks";
import type { Doctor, UpdateDoctorDto } from "../../../types";
import { FaUserMd, FaStethoscope, FaPhoneAlt, FaEnvelope, FaTimes } from "react-icons/fa";
import { AvatarUploader } from "../../../components/molecules/AvatarUploader/AvatarUploader";
import { API_BASE_URL } from "../../../utils/api/api";

export default function AdminDoctorsPage() {
  const { getAll, loading: doctorsLoading, remove, update } = useDoctors();
  const { create: createUser, loading: usersLoading } = useUsers();
  const { addNotification } = useNotification();

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [formIsOpen, setFormIsOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const loading = doctorsLoading || usersLoading;

  const fetchData = async () => {
    try {
      const resDocs: any = await getAll();
      setDoctors(Array.isArray(resDocs) ? resDocs : (resDocs?.data?.data || resDocs?.data || []));
    } catch (err) {
      console.error(err);
      addNotification('error', 'Erreur de chargement des données.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [getAll]);

  const columns: ColumnDef<Doctor>[] = [
    { header: "ID", accessorKey: "id", className: "w-16 font-medium text-slate-400" },
    {
      header: "Identité",
      render: (d) => (
        <span className="font-semibold text-white">
          {d.user?.firstName ? `Dr. ${d.user.firstName} ${d.user.lastName}` : `Docteur #${d.id}`}
        </span>
      )
    },
    {
      header: "Spécialité",
      render: (d) => <span className="text-slate-300 font-medium">{d.specialty || 'Généraliste'}</span>
    },
    {
      header: "Email",
      render: (d) => <span className="text-slate-400">{d.user?.email || '—'}</span>
    },
    {
      header: "Téléphone",
      render: (d) => <span className="text-slate-400">{d.phone || '—'}</span>
    }
  ];

  const handleDelete = async (doctor: Doctor) => {
    try {
      await remove(doctor.id);
      addNotification('success', "Le profil médical a été supprimé.");
      fetchData();
    } catch (err) {
      console.error(err);
      addNotification('error', "Impossible de supprimer ce praticien.");
    }
  };

  const openAddForm = () => {
    setEditingDoctor(null);
    setFormIsOpen(true);
  };

  const openEditForm = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormIsOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingDoctor) {
        // En édition, on met à jour uniquement la spécialité et le téléphone du profil Docteur
        await update(editingDoctor.id, data as UpdateDoctorDto);
        addNotification('success', "Médecin modifié avec succès.");
      } else {
        // En création, on appelle /auth/register via createUser car le backend génère auto le DoctorProfile
        await createUser({
          ...data,
          role: 'DOCTOR'
        });
        addNotification('success', "Le docteur a été créé. Son profil est désormais listé.");
      }
      setFormIsOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      addNotification('error', "Erreur lors de la sauvegarde.");
    }
  };

  const renderDoctorDetails = (d: Doctor) => (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-700/50 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 shrink-0">
          {d.user?.avatarUrl ? (
            <img 
              src={d.user.avatarUrl.startsWith('http') ? d.user.avatarUrl : `${API_BASE_URL}${d.user.avatarUrl}`} 
              alt="Avatar" 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xl font-bold text-slate-500 uppercase">
              {d.user?.firstName?.[0] || 'D'}
            </div>
          )}
        </div>
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-bold text-white leading-tight">
            {d.user?.firstName ? `Docteur ${d.user.firstName} ${d.user.lastName}` : `Médecin N°${d.id}`}
          </h2>
          <span className="text-slate-400 text-sm mt-1">{d.specialty || 'Généraliste'}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 text-slate-300">
          <div className="p-2 bg-slate-800 rounded text-slate-400 shrink-0"><FaStethoscope /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Spécialité Listée</p>
            <p className="text-sm font-medium text-white">{d.specialty || 'Rien à signaler'}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 text-slate-300">
          <div className="p-2 bg-slate-800 rounded text-slate-400 shrink-0"><FaPhoneAlt /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Téléphone Pro</p>
            <p className="text-sm font-medium text-white">{d.phone || 'Non renseigné'}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 text-slate-300">
          <div className="p-2 bg-slate-800 rounded text-slate-400 shrink-0"><FaEnvelope /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Courriel Sécurisé</p>
            <p className="text-sm font-medium text-white">{d.user?.email || 'Non renseigné'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Médecins</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez le personnel médical et leurs coordonnées.</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-slate-700 hover:border-slate-500"
        >
          <FaUserMd /> Ajouter un médecin
        </button>
      </div>

      <DataTable
        data={doctors}
        columns={columns}
        isLoading={loading}
        title="Répertoire Médical"
        emptyMessage="Aucun docteur enregistré."
        keyExtractor={(item) => String(item.id)}
        onDelete={handleDelete}
        onEdit={openEditForm}
        renderDetails={renderDoctorDetails}
      />

      {formIsOpen && (
        <DoctorFormModal
          doctor={editingDoctor}
          onClose={() => setFormIsOpen(false)}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      )}
    </div>
  );
}

function DoctorFormModal({ doctor, onClose, onSubmit, loading }: { doctor: Doctor | null; onClose: () => void; onSubmit: (data: any) => void; loading: boolean }) {
  const isEditing = !!doctor;

  const [formData, setFormData] = useState({
    firstName: doctor?.user?.firstName || '',
    lastName: doctor?.user?.lastName || '',
    email: doctor?.user?.email || '',
    password: '',
    specialty: doctor?.specialty || '',
    phone: doctor?.phone || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      onSubmit({
        specialty: formData.specialty,
        phone: formData.phone
      });
    } else {
      onSubmit({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
        // role "DOCTOR" is added automatically in handleFormSubmit
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-800/30">
          <h3 className="text-lg font-semibold text-white">
            {isEditing ? "Modifier le profil médical" : "Ajouter un compte médecin"}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-700 transition">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-center pb-4">
            <AvatarUploader
              userId={doctor?.userId || 0}
              currentAvatarUrl={doctor?.user?.avatarUrl}
              onAvatarUpdated={() => fetchData()}
              onAvatarDeleted={() => fetchData()}
              size="lg"
            />
          </div>
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
                <label className="block text-sm font-medium text-slate-300 mb-1">Adresse E-mail du compte</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Mot de passe initial</label>
                <input
                  required
                  type="text"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-xs text-slate-500 italic">Un profil Docteur sera généré automatiquement via cette création de compte. Sa spécialité pourra être ajoutée plus tard.</p>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Spécialité Médicale</label>
                <input
                  type="text"
                  placeholder="Ex: Cardiologie, Pédiatrie..."
                  value={formData.specialty}
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Téléphone de Contact</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
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
