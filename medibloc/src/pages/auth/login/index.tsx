import { useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { ROUTES } from '../../../utils/constants/routes.constants';
import { ROLE_DEFAULT_ROUTES } from '../../../utils/constants/roles.constants';
import { AuthLayout } from '../../../components/layouts/AuthLayout';

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
    <AuthLayout title="Bienvenue" description="Connectez-vous à votre espace personnel">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div role="alert" aria-live="assertive" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
                <FiAlertCircle className="mt-0.5 shrink-0 text-rose-500" size={18} />
                <p className="text-sm text-rose-700">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-(--ui-text)">
                Adresse email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ui-text-muted)" size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  autoComplete="email"
                  placeholder="votre@email.com"
                  className="w-full rounded-xl border border-(--ui-border) bg-(--ui-bg) py-2.5 pl-10 pr-4 text-sm text-(--ui-text) outline-none transition-all focus:border-(--ui-info) focus:ring-2 focus:ring-(--ui-info-dim)"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-(--ui-text)">
                Mot de passe
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ui-text-muted)" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-(--ui-border) bg-(--ui-bg) py-2.5 pl-10 pr-10 text-sm text-(--ui-text) outline-none transition-all focus:border-(--ui-info) focus:ring-2 focus:ring-(--ui-info-dim)"
                />
                <button
                  type="button"
                  onClick={handleToggleShowPassword}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--ui-text-muted) transition-colors hover:text-(--ui-text)"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="mt-2 w-full rounded-xl bg-linear-to-r from-[#4A90E2] to-[#2ECC71] py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 border-t border-(--ui-border-soft) pt-5 text-center">
            <p className="text-sm text-(--ui-text-muted)">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={handleGoToRegister}
                className="font-semibold text-(--ui-info) transition-opacity hover:opacity-75"
              >
                Créer un compte
              </button>
            </p>
          </div>
    </AuthLayout>
  );
}