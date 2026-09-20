import { useEffect, useRef, useState } from "react"
import { FiX } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { Footer, Header, Tooltip } from "../../components"
import { DnaCanvas } from "../../components/atoms"
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
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#F8FAFC] text-[#0B2545]">
      <div
        className="relative w-full overflow-hidden bg-white"
      >
        <div className="pointer-events-none absolute -top-10 -left-16 h-[420px] w-[420px] rounded-full bg-[#C8DFF5]/25 blur-[100px]" />
        <div className="pointer-events-none absolute top-8 right-0 h-[380px] w-[380px] rounded-full bg-[#B8D6F0]/20 blur-[90px]" />
        <div className="pointer-events-none absolute top-[55%] -left-8 h-[300px] w-[300px] rounded-full bg-[#CADEEF]/18 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-4 right-1/4 h-[350px] w-[350px] rounded-full bg-[#C0D9F0]/22 blur-[95px]" />
        <div className="pointer-events-none absolute top-1/4 left-[40%] h-[280px] w-[280px] rounded-full bg-[#D0E4F4]/15 blur-[85px]" />
        <div className="pointer-events-none absolute top-0 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#BDD8EE]/12 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-1/3 left-[15%] h-[250px] w-[250px] rounded-full bg-[#C5DDF2]/20 blur-[75px]" />
        <div className="pointer-events-none absolute top-[70%] right-[10%] h-[300px] w-[300px] rounded-full bg-[#B5D4ED]/15 blur-[85px]" />

        <div className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-45">
          <DnaCanvas />
        </div>

        <Header />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-14 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24">
          <HeroSection
            title="Modern Medical Management"
            subtitle="Secure electronic patient records, precision consultations and intelligent hospital workflow."
            cta={{
              primary: { label: 'Book An Appointment', onClick: () => { navigate(ROUTES.PUBLIC.REGISTER); } },
              secondary: { label: 'Doctor Portal', onClick: () => { navigate(ROUTES.PUBLIC.LOGIN); } },
            }}
          />
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
        <div id="services" className="mt-8 sm:mt-12">
          <ServiceSection />
        </div>
        <div id="experience" className="mt-16 sm:mt-24">
          <ExperienceSection />
        </div>
      </main>

      <footer className="w-full bg-[#0B2545] text-white">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-4 sm:px-6 lg:px-10">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="MediBloc" className="h-8 w-auto object-contain brightness-0 invert" />
              <span className="text-xl font-extrabold text-white">
                Medi<span className="text-[#7ED957]">Bloc</span>
              </span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[#9CA3AF]">
              MediBloc is your destination for world-class treatments, compassionate doctors, and precise diagnostics.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="mt-3 space-y-2 text-xs text-[#9CA3AF]">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#career" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Departments</h4>
            <ul className="mt-3 space-y-2 text-xs text-[#9CA3AF]">
              <li><a href="#cardiology" className="hover:text-white transition-colors">Cardiology</a></li>
              <li><a href="#neurology" className="hover:text-white transition-colors">Neurology</a></li>
              <li><a href="#pediatrics" className="hover:text-white transition-colors">Pediatrics</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-xs text-[#9CA3AF]">
              <li><a href="#appointments" className="hover:text-white transition-colors">Book Appointment</a></li>
              <li><a href="#portal" className="hover:text-white transition-colors">Patient Portal</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-[#6B7280]">
          © {new Date().getFullYear()} MediBloc International Hospital Ltd. All rights reserved.
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
  )
}

export default HomePage