import { useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { ROUTES } from '../../../utils/constants/routes.constants';
import { ROLE_DEFAULT_ROUTES } from '../../../utils/constants/roles.constants';

/**
 * Page de connexion
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleToggleShowPassword = useCallback(() => {
    setShowPassword((v) => !v);
  }, []);

  const handleGoToRegister = useCallback(() => {
    navigate(ROUTES.PUBLIC.REGISTER);
  }, [navigate]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await login({ email, password });

      // Redirection basée sur le rôle via mapping centralisé
      const defaultRoute = ROLE_DEFAULT_ROUTES[response.user.role] ?? ROUTES.PUBLIC.HOME;
      navigate(defaultRoute, { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-(--ui-bg)">
      <div className="w-full max-w-md">
        {/* Logo/Titre */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-(--ui-text)">
            MediBloc
          </h1>
          <p className="text-sm text-(--ui-text-secondary)">
            Connectez-vous à votre espace personnel
          </p>
        </div>

        {/* Formulaire */}
        <div className="rounded-lg p-8 shadow-sm bg-(--ui-surface)">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message d'erreur */}
            {error && (
              <div role="alert" aria-live="assertive" className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <FiAlertCircle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Champ Email */}
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
                  value={email}
                  onChange={handleEmailChange}
                  required
                  autoComplete="email"
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0 bg-(--ui-bg) border-(--ui-border) text-(--ui-text)"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
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
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0 bg-(--ui-bg) border-(--ui-border) text-(--ui-text)"
                />
                <button
                  type="button"
                  onClick={handleToggleShowPassword}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-(--ui-text-secondary) hover:text-(--color-primary)"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className={`w-full py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white ${isLoading ? 'bg-(--ui-border)' : 'bg-(--color-primary)'}`}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Lien vers inscription */}
          <div className="mt-6 text-center">
            <p className="text-sm text-(--ui-text-secondary)">
              Vous n&apos;avez pas de compte ?{' '}
              <button
                onClick={handleGoToRegister}
                className="font-medium hover:underline text-(--color-primary)"
              >
                Créer un compte patient
              </button>
            </p>
          </div>
        </div>

        {/* Note pour les médecins et admins */}
        <div className="mt-6 text-center">
          <p className="text-xs text-(--ui-text-tertiary)">
            Les espaces médecins et administrateurs nécessitent des accès spécifiques.
          </p>
        </div>
      </div>
    </div>
  );
}
