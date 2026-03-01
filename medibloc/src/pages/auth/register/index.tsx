import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { Role } from '../../../types/common/common.types';
import { ROUTES } from '../../../utils/constants/routes.constants';
import { AuthLayout } from '../../../components/layouts/AuthLayout';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const handleFirstName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value), [handleChange]);
  const handleLastName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value), [handleChange]);
  const handleEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value), [handleChange]);
  const handlePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value), [handleChange]);
  const handleConfirmPassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => handleChange('confirmPassword', e.target.value), [handleChange]);

  const handleGoToLogin = useCallback(() => {
    navigate(ROUTES.PUBLIC.LOGIN);
  }, [navigate]);

  const toggleShowPassword = useCallback(() => setShowPassword((v) => !v), []);
  const toggleShowConfirmPassword = useCallback(() => setShowConfirmPassword((v) => !v), []);

  const isFormValid = Boolean(
    formData.email &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword &&
    formData.firstName &&
    formData.lastName
  );

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!isFormValid) return;
    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: Role.PATIENT,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.PATIENT.DASHBOARD, { replace: true });
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'inscription";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const inputClass = 'w-full rounded-xl border border-(--ui-border) bg-(--ui-bg) py-2.5 pl-10 pr-4 text-sm text-(--ui-text) outline-none transition-all focus:border-(--ui-info) focus:ring-2 focus:ring-(--ui-info-dim)';

  if (success) {
    return (
      <AuthLayout title="Compte créé avec succès !" description="Vous allez être redirigé vers votre espace patient...">
        <div className="flex flex-col items-center gap-4 py-6">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <FiCheckCircle size={32} />
          </span>
          <p className="text-sm text-(--ui-text-muted)">Bienvenue sur Medibloc !</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Créer un compte" description="Rejoignez Medibloc en quelques secondes">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div role="alert" aria-live="assertive" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
                <FiAlertCircle className="mt-0.5 shrink-0 text-rose-500" size={18} />
                <p className="text-sm text-rose-700">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="block text-sm font-medium text-(--ui-text)">Prénom</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ui-text-muted)" size={18} />
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleFirstName}
                    required
                    autoComplete="given-name"
                    placeholder="Prénom"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="lastName" className="block text-sm font-medium text-(--ui-text)">Nom</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ui-text-muted)" size={18} />
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleLastName}
                    required
                    autoComplete="family-name"
                    placeholder="Nom"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-(--ui-text)">Adresse email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ui-text-muted)" size={18} />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleEmail}
                  required
                  autoComplete="email"
                  placeholder="votre@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-(--ui-text)">Mot de passe</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ui-text-muted)" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handlePassword}
                  required
                  autoComplete="new-password"
                  placeholder="Min. 6 caractères"
                  className="w-full rounded-xl border border-(--ui-border) bg-(--ui-bg) py-2.5 pl-10 pr-10 text-sm text-(--ui-text) outline-none transition-all focus:border-(--ui-info) focus:ring-2 focus:ring-(--ui-info-dim)"
                />
                <button type="button" onClick={toggleShowPassword} aria-label={showPassword ? 'Masquer' : 'Afficher'} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--ui-text-muted) hover:text-(--ui-text)">
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-(--ui-text)">Confirmer le mot de passe</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ui-text-muted)" size={18} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleConfirmPassword}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-(--ui-border) bg-(--ui-bg) py-2.5 pl-10 pr-10 text-sm text-(--ui-text) outline-none transition-all focus:border-(--ui-info) focus:ring-2 focus:ring-(--ui-info-dim)"
                />
                <button type="button" onClick={toggleShowConfirmPassword} aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--ui-text-muted) hover:text-(--ui-text)">
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="mt-2 w-full rounded-xl bg-linear-to-r from-[#4A90E2] to-[#2ECC71] py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isLoading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 border-t border-(--ui-border-soft) pt-5 text-center">
            <p className="text-sm text-(--ui-text-muted)">
              Vous avez déjà un compte ?{' '}
              <button type="button" onClick={handleGoToLogin} className="font-semibold text-(--ui-info) transition-opacity hover:opacity-75">
                Se connecter
              </button>
            </p>
          </div>
    </AuthLayout>
  );
}
  