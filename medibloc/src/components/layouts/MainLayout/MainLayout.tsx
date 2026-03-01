import type { ReactNode, SyntheticEvent } from 'react';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Tooltip } from '../../atoms';
import { Footer, Header } from '../../organisms';

type MainLayoutProps = Readonly<{
  children: ReactNode
}>;

/**
 * Layout principal de l'application
 */
export default function MainLayout({ children }: MainLayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement, Event>) => {
    event.preventDefault();
    handleClose();
  };

  return (
    <div className="relative flex min-h-screen flex-col gap-4 bg-(--ui-bg) p-3 sm:p-4">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer onOpen={handleOpen} />
      {isModalOpen && (
        <dialog
          open
          aria-labelledby="discover-title"
          className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/40 p-4"
          onCancel={handleCancel}
        >
          <div className="w-full max-w-md rounded-3xl border border-(--ui-border-soft) bg-(--ui-surface) p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 id="discover-title" className="text-2xl font-semibold text-(--ui-text)">
                  Decouvrez-nous
                </h2>
                <p className="mt-2 text-sm text-(--ui-text-muted)">
                  Retrouve-nous sur nos reseaux sociaux pour suivre nos actus.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-2 text-(--ui-text-muted) hover:bg-(--ui-surface-soft)"
                aria-label="Fermer"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            <div className="mt-6">
              <Tooltip />
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
