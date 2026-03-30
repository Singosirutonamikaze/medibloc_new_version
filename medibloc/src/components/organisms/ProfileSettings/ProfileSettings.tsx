import { useState, useEffect } from 'react';
import { useAuth, useUsers, useNotification } from '../../../hooks';
import { AvatarUploader } from '../../molecules/AvatarUploader/AvatarUploader';
import { FiCheck, FiLoader, FiUser, FiShield, FiMonitor } from 'react-icons/fi';
import { ProfileSkeleton } from './ProfileSkeleton';
import type { UpdateUserDto } from '../../../types';

type SectionType = 'profile' | 'security' | 'theme';

export function ProfileSettings() {
  const { user, updateUser: updateAuthUser, loading: authLoading } = useAuth();
  const { update: updateUserApi, loading: updating } = useUsers();
  const { addNotification } = useNotification();

  const [activeSection, setActiveSection] = useState<SectionType>('profile');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  // Use state to force skeleton visibility if needed during initial load
  const [showSkeleton, setShowSkeleton] = useState(true);
  useEffect(() => {
    if (!authLoading && user) {
      setShowSkeleton(false);
    }
  }, [authLoading, user]);

  if (showSkeleton) return <ProfileSkeleton />;

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

      updateAuthUser({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      });

      addNotification('success', 'Profil mis à jour');
    } catch (err) {
      console.error(err);
      addNotification('error', 'Échec de la mise à jour');
    }
  };

  const handleAvatarUpdated = (newUrl: string) => {
    updateAuthUser({ avatarUrl: newUrl });
  };

  const handleAvatarDeleted = () => {
    updateAuthUser({ avatarUrl: undefined });
  };

  return (
    <div className="w-full bg-linear-to-br from-slate-900 to-slate-800 rounded-xl shadow-sm border border-slate-700/50 overflow-hidden relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* Accent Line */}
      <div className="h-1 w-full bg-linear-to-r from-[#4A90E2] via-[#2ECC71] to-[#4A90E2]" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="p-5 space-y-4 no-scrollbar">
        {/* Compact Header with Actions Hub */}
        <div className="flex items-center justify-between border-b border-slate-700/30 pb-4">
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
              Paramètres
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Ici vous pouvez gérer vos paramètres et vos confidensialité
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
            <ActionButton
              active={activeSection === 'profile'}
              onClick={() => setActiveSection('profile')}
              icon={<FiUser size={16} />}
              label="Profil"
            />
            <ActionButton
              active={activeSection === 'security'}
              onClick={() => setActiveSection('security')}
              icon={<FiShield size={16} />}
              label="Sécurité"
            />
            <ActionButton
              active={activeSection === 'theme'}
              onClick={() => setActiveSection('theme')}
              icon={<FiMonitor size={16} />}
              label="Apparence"
            />
          </div>
        </div>

        {activeSection === 'profile' && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative p-0.5 bg-slate-800 rounded-full border border-slate-700/50 shadow-inner shrink-0 scale-90">
                <AvatarUploader
                  userId={user?.id || 0}
                  currentAvatarUrl={user?.avatarUrl}
                  onAvatarUpdated={handleAvatarUpdated}
                  onAvatarDeleted={handleAvatarDeleted}
                  size="lg"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-md font-bold text-white leading-none">{user?.firstName} {user?.lastName}</h3>
                <p className="text-[11px] text-slate-400 max-w-xs leading-snug">Modifiez vos informations d'identité.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Prénom</label>
                  <input
                    type="text" required value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input w-full bg-slate-800/50 border-slate-700 h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Nom</label>
                  <input
                    type="text" required value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input w-full bg-slate-800/50 border-slate-700 h-9 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email</label>
                <input
                  type="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input w-full bg-slate-800/50 border-slate-700 h-9 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit" disabled={updating}
                  className="btn-primary text-white flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                  {updating ? <FiLoader className="animate-spin" /> : <><FiCheck /> Sauvegarder</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-300 space-y-4 py-2">
            <h3 className="text-sm font-bold text-white px-1">Options de Sécurité</h3>
            <div className="grid grid-cols-1 gap-2">
              <SecurityOption title="Double Authentification (2FA)" status="Désactivé" action="Activer" />
              <SecurityOption title="Chiffrement des données" status="Actif" action="Gérer" color="text-green-500" />
              <SecurityOption title="Alertes de connexion" status="Actif" action="Gérer" color="text-green-500" />
            </div>
          </div>
        )}

        {activeSection === 'theme' && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-300 space-y-4 py-2">
            <h3 className="text-sm font-bold text-white px-1">Choix du Thème Graphique</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              <ThemeButton color="#00C878" label="MediGreen" active />
              <ThemeButton color="#3B82F6" label="BlueSky" />
              <ThemeButton color="#8B5CF6" label="Purple" />
              <ThemeButton color="#F59E0B" label="Gold" />
              <ThemeButton color="#EF4444" label="Blood" />
              <ThemeButton color="#64748B" label="Slate" />
              <ThemeButton color="#FFFFFF" label="White" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${active
          ? 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20 shadow-xs'
          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
        }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function SecurityOption({ title, status, action, color = 'text-slate-500' }: { title: string; status: string; action: string; color?: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-700/50 rounded-lg">
      <div className="space-y-0.5">
        <p className="text-[11px] font-bold text-slate-300">{title}</p>
        <p className={`text-[10px] ${color} font-medium`}>{status}</p>
      </div>
      <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-tight">{action}</button>
    </div>
  );
}

function ThemeButton({ color, label, active }: { color: string; label: string; active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-2 group p-2 rounded-lg transition-colors ${active ? 'bg-slate-800' : 'hover:bg-slate-800/50'}`}>
      <div
        className={`h-8 w-8 rounded-full border-2 transition-transform group-hover:scale-110 ${active ? 'border-white shadow-lg' : 'border-slate-700'}`}
        style={{ backgroundColor: color }}
      />
      <span className={`text-[9px] font-bold uppercase tracking-tighter ${active ? 'text-white' : 'text-slate-500'}`}>{label}</span>
    </button>
  );
}
