import { ProfileSettings } from '../../../components/organisms/ProfileSettings/ProfileSettings';

/**
 * Page de profil spécifique au Docteur
 */
export default function DoctorProfilePage() {
  return (
    <div className="py-10 max-w-4xl mx-auto px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Mon Profil Docteur</h1>
        <p className="text-slate-400">Gérez vos paramètres praticien et votre sécurité.</p>
      </div>
      
      <ProfileSettings />
    </div>
  );
}
