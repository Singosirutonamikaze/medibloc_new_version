import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { Role } from '../../../types/common/common.types';
import { ROUTES } from '../../../utils/constants/routes.constants';

/**
 * Page d'inscription
 */
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

  const toggleShowPassword = useCallback(() => {
    setShowPassword((v) => !v);
  }, []);

  const toggleShowConfirmPassword = useCallback(() => {
    setShowConfirmPassword((v) => !v);
  }, []);

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

    // Validation côté client (déjà couverte par isFormValid)
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

      // Redirection après 2 secondes
      setTimeout(() => {
        navigate(ROUTES.PATIENT.DASHBOARD, { replace: true });
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'inscription";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-(--ui-bg)">
        <div className="w-full max-w-md text-center">
          <div className="rounded-lg p-8 shadow-sm bg-(--ui-surface)">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <FiCheckCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2 text-(--ui-text)">
              Compte créé avec succès !
            </h2>
            <p className="text-sm text-(--ui-text-secondary)">
              Vous allez être redirigé vers votre espace patient...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-(--ui-bg)">
      <div className="w-full max-w-md">
        {/* Logo/Titre */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-(--ui-text)">
            MediBloc
          </h1>
          <p className="text-sm text-(--ui-text-secondary)">
            Créez votre compte patient
          </p>
        </div>

        {/* Formulaire */}
        <div className="rounded-lg p-8 shadow-sm bg-(--ui-surface)">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Message d'erreur */}
            {error && (
              <div role="alert" aria-live="assertive" className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <FiAlertCircle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Prénom */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-(--ui-text)">
                Prénom
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ui-text-secondary)"
                  size={20}
                />
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleFirstName}
                  required
                  autoComplete="given-name"
                  placeholder="Votre prénom"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0 bg-(--ui-bg) border-(--ui-border) text-(--ui-text)"
                />
              </div>
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-(--ui-text)">
                Nom
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ui-text-secondary)"
                  size={20}
                />
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleLastName}
                  required
                  autoComplete="family-name"
                  placeholder="Votre nom"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0 bg-(--ui-bg) border-(--ui-border) text-(--ui-text)"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-(--ui-text)">
                Adresse email
              </label>    
              <div className="relative">
                <FiMail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ui-text-secondary)"
                  size={20}
                />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleEmail}
                  required
                  autoComplete="email"
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0 bg-(--ui-bg) border-(--ui-border) text-(--ui-text)"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-(--ui-text)">
                Mot de passe
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ui-text-secondary)"
                  size={20}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handlePassword}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0 bg-(--ui-bg) border-(--ui-border) text-(--ui-text)"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-(--ui-text-secondary) hover:text-(--color-primary)"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-(--ui-text)">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ui-text-secondary)"
                  size={20}
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleConfirmPassword}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0 bg-(--ui-bg) border-(--ui-border) text-(--ui-text)"
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  aria-label={showConfirmPassword ? 'Masquer la confirmation du mot de passe' : 'Afficher la confirmation du mot de passe'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-(--ui-text-secondary) hover:text-(--color-primary)"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white ${isLoading ? 'bg-(--ui-border)' : 'bg-(--color-primary)'}`}
            >
              {isLoading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Lien vers connexion */}
          <div className="mt-6 text-center">
            <p className="text-sm text-(--ui-text-secondary)">
              Vous avez déjà un compte ?{' '}
              <button
                onClick={handleGoToLogin}
                className="font-medium hover:underline text-(--color-primary)"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
