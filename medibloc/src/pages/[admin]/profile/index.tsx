import { ProfileSettings } from '../../../components/organisms/ProfileSettings/ProfileSettings';

/**
 * Page de profil spécifique à l'Administrateur
 */
export default function AdminProfilePage() {
  return (
    <div className="py-10 max-w-full mx-auto px-4">
      <ProfileSettings />
    </div>
  );
}
