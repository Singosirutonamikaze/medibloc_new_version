import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiAward,
  FiBell,
  FiHeart,
  FiMenu,
} from 'react-icons/fi';
import { Button } from '../../atoms';
import { ROUTES } from '../../../utils/constants/routes.constants';
import logo from '../../../assets/logo/logo.png';

type HeaderIconButtonProps = Readonly<{
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
  children: ReactNode
}>;

const iconClass = 'shrink-0 transition-transform duration-200 group-hover:scale-110';

const HeaderIconButton = ({
  label,
  active = false,
  onClick,
  className = '',
  children,
}: HeaderIconButtonProps) => (
  <Button
    type="button"
    variant="primary"
    aria-label={label}
    onClick={onClick}
    className={`group relative size-10 rounded-xl border-0! bg-transparent! p-0 text-(--ui-text-muted)! shadow-none! transition-all duration-200 hover:-translate-y-0.5 hover:bg-transparent! hover:text-(--color-primary)! ${active ? 'text-(--color-primary)!' : ''} ${className}`.trim()}
  >
    {active && (
      <span className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-(--color-primary)" />
    )}
    {children}
  </Button>
);

const formattedDate = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
}).format(new Date());

const displayDate = `${formattedDate.charAt(0).toUpperCase()}${formattedDate.slice(1).replace('.', '')}`;

const utilityActionLabels = {
  favoris: 'Favoris',
  recompenses: 'Récompenses',
  notifications: 'Notifications',
} as const;

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeUtilityActions, setActiveUtilityActions] = useState({
    favoris: false,
    recompenses: false,
    notifications: false,
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!feedbackMessage) {
      return;
    }

    const timeoutId = globalThis.setTimeout(() => {
      setFeedbackMessage('');
    }, 2200);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [feedbackMessage]);

  const handleMenuToggle = () => {
    setIsMenuOpen((previous) => !previous);
  };

  const handleNavigate = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const toggleUtilityAction = (action: 'favoris' | 'recompenses' | 'notifications') => {
    setActiveUtilityActions((previous) => {
      const nextIsActive = !previous[action];
      const actionLabel = utilityActionLabels[action];
      setFeedbackMessage(nextIsActive ? `${actionLabel} activé` : `${actionLabel} désactivé`);

      return {
        ...previous,
        [action]: nextIsActive,
      };
    });
  };

  return (
    <header className="app-surface w-full px-3 py-3 sm:px-4">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 items-center justify-center rounded-xl bg-white px-3 shadow-sm">
            <img
              src={logo}
              alt="Medibloc"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <HeaderIconButton
            label="Favoris"
            active={activeUtilityActions.favoris}
            onClick={() => toggleUtilityAction('favoris')}
          >
            <FiHeart size={20} strokeWidth={2.2} className={iconClass} />
          </HeaderIconButton>
          <HeaderIconButton
            label="Récompenses"
            active={activeUtilityActions.recompenses}
            onClick={() => toggleUtilityAction('recompenses')}
            className="hidden sm:inline-flex"
          >
            <FiAward size={20} strokeWidth={2.2} className={iconClass} />
          </HeaderIconButton>
          <HeaderIconButton
            label="Notifications"
            active={activeUtilityActions.notifications}
            onClick={() => toggleUtilityAction('notifications')}
            className="hidden sm:inline-flex"
          >
            <FiBell size={20} strokeWidth={2.2} className={iconClass} />
          </HeaderIconButton>

          <span className="hidden h-10 items-center rounded-xl bg-(--ui-surface-soft) px-3 text-xs font-semibold tracking-wide text-(--ui-text-muted) lg:inline-flex">
            {displayDate}
          </span>

          <div ref={menuRef} className="relative">
            <Button
              type="button"
              variant="primary"
              className="group size-10 rounded-xl border-0! bg-transparent! p-0 text-(--ui-text-muted)! hover:bg-transparent! hover:text-(--color-primary)!"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              onClick={handleMenuToggle}
            >
              <FiMenu size={20} strokeWidth={2.2} className={`${iconClass} ${isMenuOpen ? 'rotate-90' : ''}`} />
            </Button>

            {isMenuOpen && (
              <div
                className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) p-2 shadow-sm"
                aria-label="Menu utilisateur"
              >
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full justify-center border-0! bg-(--ui-surface-soft)! text-(--ui-text)! hover:text-(--color-primary)!"
                    onClick={() => handleNavigate(ROUTES.PUBLIC.LOGIN)}
                  >
                    Se connecter
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full justify-center border-0! bg-(--ui-surface-soft)! text-(--ui-text)! hover:text-(--color-primary)!"
                    onClick={() => handleNavigate(ROUTES.PUBLIC.REGISTER)}
                  >
                    Créer un compte
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div className="mt-2 hidden items-center justify-end md:flex">
          <span className="rounded-lg bg-(--ui-surface-soft) px-3 py-1 text-xs font-medium text-(--ui-text-muted)">
            {feedbackMessage}
          </span>
        </div>
      )}
    </header>
  );
};
