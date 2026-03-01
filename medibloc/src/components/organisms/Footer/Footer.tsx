import { FiShare2 } from 'react-icons/fi';

type FooterProps = Readonly<{
  onOpen: () => void
}>;

export const Footer = ({ onOpen }: FooterProps) => {
  return (
    <div>
      <footer className="fixed right-4 bottom-20 z-40 h-16 w-16 sm:right-6 sm:bottom-20">
        <button
          type="button"
          aria-label="Ouvrir le menu social"
          onClick={onOpen}
          className="flex h-full w-full items-center justify-center rounded-full border border-(--ui-border-soft) bg-(--ui-surface) text-(--color-primary) shadow-sm transition-all hover:-translate-y-0.5 hover:bg-(--ui-surface-soft)"
        >
          <FiShare2 className="text-2xl" />
        </button>
      </footer>

    </div>
  );
};
