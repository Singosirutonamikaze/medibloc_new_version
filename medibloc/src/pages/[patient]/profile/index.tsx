import { ProfileSettings } from '../../../components/organisms/ProfileSettings/ProfileSettings';

/**
 * Page du profil du patient
 */
export default function PatientProfilePage() {
  return (
    <div className="py-10 max-w-4xl mx-auto px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Mon Profil</h1>
        <p className="text-slate-400">Gérez vos informations personnelles et votre sécurité.</p>
      </div>
      
      <ProfileSettings />
    </div>
  );
}

