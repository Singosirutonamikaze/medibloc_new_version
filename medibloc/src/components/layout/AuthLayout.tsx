import type { ReactNode } from 'react';

type AuthLayoutProps = Readonly<{
  children: ReactNode
}>;

/**
 * Layout pour les pages d'authentification
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-logo">
          {/* Logo de l'application */}
        </div>
        <div className="auth-content">{children}</div>
      </div>
    </div>
  );
}
