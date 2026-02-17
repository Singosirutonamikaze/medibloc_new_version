import type { ReactNode } from 'react';

type MainLayoutProps = Readonly<{
  children: ReactNode
}>;

/**
 * Layout principal de l'application
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <header>
        {/* Navigation principale */}
      </header>
      <main>{children}</main>
      <footer>
        {/* Footer */}
      </footer>
    </div>
  );
}
