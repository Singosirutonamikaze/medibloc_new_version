import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiMenu,
} from 'react-icons/fi';
import { Button } from '../../atoms';
import { ROUTES } from '../../../utils/constants/routes.constants';
import logo from '../../../assets/logo/logo.png';
const iconClass = 'shrink-0 transition-transform duration-200 group-hover:scale-110';

const formatFullDateTime = (value: Date) => {
  const datePart = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(value);

  const timePart = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(value);

  return `${datePart.charAt(0).toUpperCase()}${datePart.slice(1)} • ${timePart}`;
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

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
    const intervalId = globalThis.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      globalThis.clearInterval(intervalId);
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen((previous) => !previous);
  };

  const handleNavigate = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="w-full bg-transparent px-3 py-3 sm:px-4">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 rounded-xl border border-(--ui-border-soft) bg-linear-to-r from-(--ui-surface) via-(--ui-surface) to-(--ui-surface-soft) px-3 py-2 shadow-sm sm:gap-3 sm:px-4">
        <div className="flex items-center gap-3 bg-white rounded-2xl">
          <img
            src={logo}
            alt="Medibloc"
            className="h-9 w-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="hidden h-10 items-center rounded-xl border border-(--ui-border-soft) bg-linear-to-r from-(--ui-info-dim) to-(--ui-surface-soft) px-3 text-xs font-semibold tracking-wide text-(--ui-text) sm:inline-flex">
            {formatFullDateTime(now)}
          </span>

          <div ref={menuRef} className="relative">
            <Button
              type="button"
              variant="primary"
              className="group size-10 rounded-xl border border-(--ui-border-soft)! bg-(--ui-info-dim)! p-0 text-(--ui-text-muted)! shadow-none! hover:bg-(--ui-info-dim)! hover:text-(--ui-info)!"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              onClick={handleMenuToggle}
            >
              <FiMenu size={20} strokeWidth={2.2} className={`${iconClass} ${isMenuOpen ? 'rotate-90' : ''}`} />
            </Button>

            {isMenuOpen && (
              <div
                className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-(--ui-info) bg-linear-to-b from-(--ui-surface) to-(--ui-surface-soft) p-2 shadow-md"
                aria-label="Menu utilisateur"
              >
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full justify-center border-0! bg-(--ui-surface-soft)! text-(--ui-text)! hover:bg-(--ui-info-dim)! hover:text-(--ui-info)!"
                    onClick={() => handleNavigate(ROUTES.PUBLIC.LOGIN)}
                  >
                    Se connecter
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full justify-center border-0! bg-(--ui-surface-soft)! text-(--ui-text)! hover:bg-(--ui-info-dim)! hover:text-(--ui-info)!"
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

    </header>
  );
};
