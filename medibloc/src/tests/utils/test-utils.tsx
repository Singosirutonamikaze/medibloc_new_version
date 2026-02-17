import { type ReactNode } from 'react';
import { render, renderHook } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext/AuthContext';

interface RenderOptions {
  withAuth?: boolean;
}

export function renderWithProviders(
  ui: ReactNode,
  { withAuth = true }: RenderOptions = {}
) {
  let Wrapper = ({ children }: { children: ReactNode }) => <>{children}</>;

  if (withAuth) {
    Wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}

export function renderHookWithAuth<TResult>(
  hook: () => TResult
) {
  return renderHook(hook, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    ),
  });
}
