import { useEffect, useRef, useState } from "react"
import { FiX } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { Footer, Header, Tooltip } from "../../components"
import { HeroSection } from "../../components/molecules/HeroSection"
import logo from "../../assets/logo/logo.png"
import { ROUTES } from "../../utils/constants/routes.constants"
import { ServiceSection } from "../../components/molecules/ServiceSection"
import { ActiviteSection } from "../../components/molecules/ActiviteSection"
import { ExperienceSection } from "../../components/molecules/ExperienceSection"

function HomePage() {
  const [isSocialOpen, setIsSocialOpen] = useState(false)
  const tooltipPanelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSocialOpen) {
      return
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!tooltipPanelRef.current?.contains(event.target as Node)) {
        setIsSocialOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSocialOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isSocialOpen])

  return (
    <div className="relative min-h-screen overflow-hidden bg-(--ui-bg)">
      <div className="pointer-events-none absolute -left-24 -top-12 h-72 w-72 rounded-full bg-(--ui-info-dim) blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-(--ui-info-dim) blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-(--ui-surface-soft) via-(--ui-surface) to-transparent" />

      <div className="relative px-2 sm:px-0">
        <Header />

        <main className="mx-auto mt-8 w-full max-w-7xl px-3 pb-28 sm:px-4">
          <HeroSection
            title="Medibloc simplifie votre travail au quotidien"
            subtitle="Vous gérez les patients, les rendez-vous, les prescriptions et les dossiers médicaux dans un seul outil. Vous gagnez du temps et vous améliorez la qualité du suivi."
            cta={{
              primary: { label: 'Accéder à la plateforme', onClick: () => { globalThis.location.href = '/login'; } },
              secondary: { label: 'Créer un compte', onClick: () => { globalThis.location.href = '/register'; } },
            }}
          />
          <ServiceSection />
          <ActiviteSection />
          <ExperienceSection />
        </main>

        <footer className="border-t border-(--ui-border-soft) bg-(--ui-surface)">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-3 sm:py-10">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
                  <img src={logo} alt="Medibloc" className="h-7 w-auto object-contain" />
                </div>
                <span className="text-base font-bold bg-linear-to-r from-[#4A90E2] to-[#2ECC71] bg-clip-text text-transparent">
                  Medi<span className="text-[#2ECC71]">Bloc</span>
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-(--ui-text-muted)">
                Une plateforme conçue pour simplifier la gestion médicale au quotidien.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-(--ui-text)">Accès rapide</h4>
              <ul className="mt-3 space-y-2">
                <li>
                  <button type="button" onClick={() => navigate(ROUTES.PUBLIC.LOGIN)} className="text-sm text-(--ui-text-muted) transition-colors hover:text-(--ui-text)">
                    Connexion
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate(ROUTES.PUBLIC.REGISTER)} className="text-sm text-(--ui-text-muted) transition-colors hover:text-(--ui-text)">
                    Créer un compte
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-(--ui-text)">À propos</h4>
              <p className="mt-3 text-sm leading-relaxed text-(--ui-text-muted)">
                Medibloc est une solution médicale pensée pour les professionnels de santé et leurs patients.
                Sécurisée, simple et disponible en tout lieu.
              </p>
              <div className="mt-3">
                <button type="button" onClick={() => navigate(ROUTES.PUBLIC.REGISTER)} className="text-sm font-medium text-(--ui-info) transition-opacity hover:opacity-75">
                  Commencer gratuitement →
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-(--ui-border-soft) py-4 text-center text-xs text-(--ui-text-muted)">
            © {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} Medibloc — L'amour de la santé est unique pour ton bonheur.
          </div>
        </footer>

        {isSocialOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <button
              type="button"
              aria-label="Fermer le panneau social"
              onClick={() => setIsSocialOpen(false)}
              className="absolute inset-0"
            />

            <div
              ref={tooltipPanelRef}
              className="relative z-50 w-[min(92vw,420px)] overflow-hidden rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) shadow-2xl"
            >
            
              <div className="flex items-center justify-between border-b border-(--ui-border-soft) px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <p className="text-sm font-semibold text-(--ui-text)">Suivez-nous</p>
                </div>
                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={() => setIsSocialOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-(--ui-text-muted) transition-colors hover:bg-(--ui-surface-soft) hover:text-(--ui-text)"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Corps */}
              <div className="px-5 py-6">
                <p className="mb-5 text-center text-xs text-(--ui-text-muted)">
                  Retrouvez Medibloc sur vos plateformes préférées
                </p>
                <Tooltip />
              </div>
            </div>
          </div>
        )}

        <Footer onOpen={() => setIsSocialOpen((previous) => !previous)} />
      </div>
    </div>
  )
}

export default HomePage