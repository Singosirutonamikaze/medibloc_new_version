import React, { useState } from 'react';
import { useAuth, useUsers, useNotification } from '../../../hooks';
import { AvatarUploader } from '../../molecules/AvatarUploader/AvatarUploader';
import { FiUser, FiMail, FiCheck, FiLoader } from 'react-icons/fi';
import type { UpdateUserDto } from '../../../types';

export function ProfileSettings() {
  const { user, updateUser: updateAuthUser } = useAuth();
  const { update: updateUserApi, loading } = useUsers();
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const updateData: UpdateUserDto = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      const updatedUser = await updateUserApi(user.id, updateData);
      
      // Update AuthContext globally to refresh Navbar, etc.
      updateAuthUser({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      });

      addNotification('success', 'Profil mis à jour avec succès');
    } catch (err) {
      console.error(err);
      addNotification('error', 'Erreur lors de la mise à jour du profil');
    }
  };

  const handleAvatarUpdated = (newUrl: string) => {
    updateAuthUser({ avatarUrl: newUrl });
  };

  const handleAvatarDeleted = () => {
    updateAuthUser({ avatarUrl: undefined });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <AvatarUploader
            userId={user?.id || 0}
            currentAvatarUrl={user?.avatarUrl}
            onAvatarUpdated={handleAvatarUpdated}
            onAvatarDeleted={handleAvatarDeleted}
            size="xl"
          />
          <h2 className="mt-6 text-2xl font-bold text-white">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-slate-400 text-sm">{user?.role === 'PATIENT' ? 'Patient' : user?.role === 'DOCTOR' ? 'Docteur' : 'Administrateur'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">Prénom</label>
              <div className="relative group">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-500" />
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">Nom</label>
              <div className="relative group">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-500" />
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                  placeholder="Votre nom"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">Adresse Email</label>
            <div className="relative group">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-500" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <FiLoader className="animate-spin" />
              ) : (
                <>
                  <FiCheck className="transition-transform group-hover:scale-110" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
        <p className="text-xs text-slate-500 text-center uppercase tracking-[0.2em]">
          Dernière mise à jour du profil : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
