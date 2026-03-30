import { useEffect, useState } from "react";
import { DataTable } from "../../../components/organisms/DataTable";
import type { ColumnDef } from "../../../components/organisms/DataTable/DataTable";
import { useUsers, useNotification } from "../../../hooks";
import type { User, CreateUserDto, UpdateUserDto } from "../../../types";
import { FaUserPlus, FaEnvelope, FaFingerprint, FaCalendarAlt, FaTimes } from "react-icons/fa";
import { AvatarUploader } from "../../../components/molecules/AvatarUploader/AvatarUploader";
import { API_BASE_URL } from "../../../utils/api/api";

export default function AdminUsersPage() {
  const { getAll, loading, remove, create, update } = useUsers();
  const { addNotification } = useNotification();
  const [users, setUsers] = useState<User[]>([]);
  
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = () => {
    getAll().then((res: any) => {
      let safeArray: User[] = [];
      if (Array.isArray(res)) safeArray = res;
      else if (res?.data && Array.isArray(res.data)) safeArray = res.data;
      else if (res?.data?.data && Array.isArray(res.data.data)) safeArray = res.data.data;
      
      setUsers(safeArray);
    }).catch((err) => {
      console.error(err);
      addNotification('error', 'Erreur lors du chargement des utilisateurs.');
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [getAll]);

  const getRoleLabel = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
      case 'SUPERADMIN': return 'Administrateur général';
      case 'DOCTOR': return 'Médecin';
      case 'PATIENT': return 'Patient';
      default: return 'Utilisateur';
    }
  };

  const columns: ColumnDef<User>[] = [
    { header: "ID", accessorKey: "id", className: "w-16 font-medium text-slate-400" },
    { 
      header: "Nom Complet", 
      render: (u) => <span className="font-semibold text-white">{u.firstName} {u.lastName}</span> 
    },
    { header: "Email", accessorKey: "email", className: "text-slate-300" },
    { 
      header: "Rôle", 
      render: (u) => {
        let roleStyles = "text-slate-300";
        const roleUpper = u.role?.toUpperCase();
        if (roleUpper === 'ADMIN' || roleUpper === 'SUPERADMIN') roleStyles = "text-purple-400";
        if (roleUpper === 'DOCTOR') roleStyles = "text-[#4A90E2]";
        if (roleUpper === 'PATIENT') roleStyles = "text-[#2ECC71]";
        
        return <span className={`font-medium ${roleStyles}`}>{getRoleLabel(u.role)}</span>;
      }
    },
    { 
      header: "Date de création", 
      className: "text-slate-400",
      render: (u) => new Date(u.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
      }) 
    }
  ];

  const handleDelete = async (user: User) => {
    try {
      await remove(user.id);
      addNotification('success', "Utilisateur supprimé avec succès.");
      fetchUsers();
    } catch (err) {
      console.error(err);
      addNotification('error', "Une erreur est survenue lors de la suppression.");
    }
  };

  const openAddForm = () => {
    setEditingUser(null);
    setFormIsOpen(true);
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setFormIsOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingUser) {
         await update(editingUser.id, data as UpdateUserDto);
         addNotification('success', "Utilisateur modifié avec succès.");
      } else {
         await create(data as CreateUserDto);
         addNotification('success', "Nouvel utilisateur créé avec succès.");
      }
      setFormIsOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      addNotification('error', "Erreur lors de la sauvegarde.");
    }
  };

  const renderUserDetails = (user: User) => (
    <div className="space-y-6">
       <div className="pb-4 border-b border-slate-700/50 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 shrink-0">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `${API_BASE_URL}${user.avatarUrl}`} 
                alt="Avatar" 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xl font-bold text-slate-500 uppercase">
                {user.firstName?.[0] || 'U'}
              </div>
            )}
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-xl font-bold text-white leading-tight">{user.firstName} {user.lastName}</h2>
            <span className="text-slate-400 text-sm mt-1">{getRoleLabel(user.role)}</span>
          </div>
       </div>

       <div className="space-y-4">
          <div className="flex items-start gap-4 text-slate-300">
             <div className="p-2 bg-slate-800 rounded text-slate-400 shrink-0"><FaFingerprint /></div>
             <div>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Identifiant</p>
               <p className="text-sm font-medium text-white">#{user.id}</p>
             </div>
          </div>
          <div className="flex items-start gap-4 text-slate-300">
             <div className="p-2 bg-slate-800 rounded text-slate-400 shrink-0"><FaEnvelope /></div>
             <div>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
               <p className="text-sm font-medium text-white">{user.email}</p>
             </div>
          </div>
          <div className="flex items-start gap-4 text-slate-300">
             <div className="p-2 bg-slate-800 rounded text-slate-400 shrink-0"><FaCalendarAlt /></div>
             <div>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Création du compte</p>
               <p className="text-sm font-medium text-white">
                 {new Date(user.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
               </p>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Administration des Utilisateurs</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez la liste complète des comptes de la plateforme.</p>
        </div>
        <button 
          onClick={openAddForm}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-slate-700 hover:border-slate-500"
        >
          <FaUserPlus /> Ajouter un utilisateur
        </button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        isLoading={loading}
        title="Liste des utilisateurs"
        emptyMessage="Aucun utilisateur n'a pu être trouvé."
        keyExtractor={(item) => String(item.id)}
        onDelete={handleDelete}
        onEdit={openEditForm}
        renderDetails={renderUserDetails}
      />

      {formIsOpen && (
        <UserFormModal 
          user={editingUser} 
          onClose={() => setFormIsOpen(false)} 
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      )}
    </div>
  );
}

function UserFormModal({ user, onClose, onSubmit, loading }: { user: User | null; onClose: () => void; onSubmit: (data: any) => void; loading: boolean }) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'USER'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...formData };
    if (user) {
      delete payload.password; // On ne modifie pas le mdp par ici par défaut, sauf si on demande spécifiquement
      if (!payload.email) delete payload.email;
    }
    onSubmit(payload);
  };

  const isEditing = !!user;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-800/30">
          <h3 className="text-lg font-semibold text-white">
            {isEditing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-700 transition">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-center pb-4">
            <AvatarUploader
              userId={user?.id || 0}
              currentAvatarUrl={user?.avatarUrl}
              onAvatarUpdated={() => fetchUsers()}
              onAvatarDeleted={() => fetchUsers()}
              size="lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Prénom</label>
              <input 
                required
                type="text"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nom</label>
              <input 
                required
                type="text"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Adresse E-mail</label>
            <input 
              required={!isEditing}
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Mot de passe provisoire</label>
              <input 
                required
                type="text"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Attribution du Rôle</label>
            <select
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="USER">Utilisateur (Standard)</option>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Médecin</option>
              <option value="ADMIN">Administrateur général</option>
            </select>
          </div>

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
              {loading ? "Enregistrement..." : (isEditing ? "Enregistrer" : "Créer l'utilisateur")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}