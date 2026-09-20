import { useEffect, useRef } from 'react';
import {
  FiArrowUpRight,
  FiAward,
} from 'react-icons/fi';
import {
  RiBrainLine,
  RiHeartPulseLine,
  RiLungsLine,
  RiStethoscopeLine,
} from 'react-icons/ri';
import { FaBriefcaseMedical } from 'react-icons/fa';
import gsap from 'gsap';
import corpsHumainImg from '../../../assets/glass/humman-corps.png';
import poumonsImg from '../../../assets/glass/poumons.png';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  cta?: {
    primary: { label: string; onClick: () => void };
    secondary?: { label: string; onClick: () => void };
  };
}

const HEALTH_CARDS = [
  {
    icon: RiBrainLine,
    title: 'Brain Health',
    sub: 'Check',
    variant: 'light' as const,
  },
  {
    icon: RiHeartPulseLine,
    title: 'Liver Function',
    sub: 'Test',
    variant: 'light' as const,
  },
  {
    icon: RiLungsLine,
    title: 'Kidney Health',
    sub: 'Scan',
    variant: 'dark' as const,
  },
];

export const HeroSection = ({ cta }: HeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const cardsRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftColRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo(
        rightColRef.current,
        { opacity: 0, scale: 0.92, y: 25 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.15 }
      );

      gsap.fromTo(
        '.hero-float-badge',
        { opacity: 0, y: 15, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, delay: 0.5, ease: 'back.out(1.4)' }
      );

      gsap.fromTo(
        cardsRowRef.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.4, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-visible pt-2 pb-4 sm:pt-4 lg:pt-6"
    >
      <div className="relative z-10 mx-auto flex w-full flex-col">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div ref={leftColRef} className="flex flex-col lg:col-span-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D6E4F0]/60 bg-white/80 px-4 py-1.5 text-xs font-bold text-[#0B2545] shadow-[0_2px_10px_rgba(11,37,69,0.05)] backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7ED957]/15 text-[#7ED957]">
                <RiStethoscopeLine className="h-3 w-3 text-[#12315C]" />
              </span>
              <span>Fast Treatment</span>
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-[#0B2545] sm:text-6xl lg:text-7xl uppercase leading-[0.95]">
              QUICK <br />
              <span className="inline-flex items-center gap-3">
                SMART
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D6E4F0]/50 bg-white/80 text-[#0B2545] shadow-[0_4px_12px_rgba(11,37,69,0.08)] backdrop-blur-md">
                  <RiStethoscopeLine className="h-6 w-6" />
                </span>
              </span> <br />
              MEDIC
            </h1>

            <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-[#4A5568] sm:text-base">
              <strong className="font-bold text-[#0B2545]">MediBloc</strong> is your destination for world-class treatments, <strong className="font-bold text-[#0B2545]">compassionate doctors</strong>, and precise diagnostics all under one roof.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={cta?.primary.onClick}
                className="group inline-flex items-center gap-3 rounded-full bg-[#0B2545] pl-7 pr-2.5 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(11,37,69,0.2)] transition-all duration-300 hover:bg-[#12315C] hover:shadow-[0_12px_28px_rgba(11,37,69,0.3)]"
              >
                <span>Explore More</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7ED957] text-[#0B2545] transition-transform duration-300 group-hover:scale-110">
                  <FiArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </div>
          </div>

          <div ref={rightColRef} className="relative lg:col-span-7 flex justify-center items-end min-h-[520px]">
            <div className="relative flex items-end justify-center gap-5 w-full">
              <div className="relative flex flex-col items-center justify-end overflow-hidden rounded-t-[160px] rounded-b-[28px] bg-linear-to-b from-[#F2F7FC] via-[#EAF1F9]/60 to-white/90 border border-[#E0EAF3]/50 shadow-[0_16px_48px_rgba(11,37,69,0.08)] w-[280px] sm:w-[300px] h-[460px]">
                <div className="absolute inset-0 bg-radial from-transparent to-[#E0EDF8]/15" />
                <img
                  src={corpsHumainImg}
                  alt="Human Body 3D Scan"
                  className="relative z-10 h-full w-auto scale-105 object-contain object-bottom drop-shadow-[0_10px_25px_rgba(0,100,200,0.15)] transition-transform duration-500 hover:scale-108"
                />
              </div>

              <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-t-[160px] rounded-b-[28px] bg-linear-to-b from-[#EDF4FC] via-[#E5EFF9]/50 to-white/90 border border-[#E0EAF3]/50 shadow-[0_16px_48px_rgba(11,37,69,0.08)] w-[280px] sm:w-[300px] h-[460px]">
                <div className="absolute inset-0 bg-radial from-[#D4E6F8]/20 to-transparent" />
                <img
                  src={poumonsImg}
                  alt="Lungs 3D Scan"
                  className="relative z-10 h-[85%] w-auto scale-100 object-contain drop-shadow-[0_10px_25px_rgba(0,100,200,0.15)] transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="hero-float-badge absolute top-6 right-8 z-20 flex items-center gap-2.5 rounded-2xl border border-[#E0EAF3]/60 bg-white/90 px-4 py-2.5 shadow-[0_8px_24px_rgba(11,37,69,0.08)] backdrop-blur-lg transition-transform duration-300 hover:-translate-y-0.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDF3FB]">
                  <FiAward className="h-4 w-4 text-[#0B2545]" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-black text-[#0B2545] leading-none">490</div>
                  <div className="text-[10px] font-semibold text-[#6B7280] uppercase mt-0.5 tracking-wider">Awards</div>
                </div>
              </div>

              <div className="hero-float-badge absolute top-1/2 -right-2 z-20 flex items-center gap-2.5 rounded-2xl border border-[#E0EAF3]/60 bg-white/90 px-4 py-2.5 shadow-[0_8px_24px_rgba(11,37,69,0.08)] backdrop-blur-lg transition-transform duration-300 hover:-translate-y-0.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDF3FB]">
                  <RiLungsLine className="h-4 w-4 text-[#0B2545]" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-black text-[#0B2545] leading-none">6700</div>
                  <div className="text-[10px] font-semibold text-[#6B7280] mt-0.5">Medical Lungs</div>
                </div>
              </div>

              <div className="hero-float-badge absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 rounded-2xl border border-[#E0EAF3]/60 bg-white/90 px-5 py-3 shadow-[0_8px_24px_rgba(11,37,69,0.08)] backdrop-blur-lg transition-transform duration-300 hover:-translate-y-0.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B2545]">
                  <FaBriefcaseMedical className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-black text-[#0B2545] leading-none">22 Years</div>
                  <div className="text-[10px] font-semibold text-[#6B7280] mt-0.5 tracking-wide">Medical Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={cardsRowRef} className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {HEALTH_CARDS.map((card) => {
            const IconComp = card.icon;
            const isDark = card.variant === 'dark';
            return (
              <div
                key={card.title}
                className={`group relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 min-h-[155px] ${
                  isDark
                    ? 'border border-[#0B2545] bg-[#0B2545] text-white shadow-[0_12px_30px_rgba(11,37,69,0.2)] hover:bg-[#12315C] hover:shadow-[0_20px_40px_rgba(11,37,69,0.3)]'
                    : 'border border-[#E0EAF3]/60 bg-white/85 shadow-[0_8px_24px_rgba(11,37,69,0.06)] backdrop-blur-lg hover:bg-white hover:shadow-[0_16px_36px_rgba(11,37,69,0.1)]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isDark ? 'bg-[#1A3D68]' : 'bg-[#EDF3FB]'}`}>
                    <IconComp className={`h-7 w-7 ${isDark ? 'text-[#7ED957]' : 'text-[#0B2545]'}`} />
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7ED957] text-[#0B2545] shadow-xs transition-transform group-hover:scale-110">
                    <FiArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-3">
                  <h4 className={`text-base font-black leading-tight ${isDark ? 'text-white' : 'text-[#0B2545]'}`}>{card.title}</h4>
                  <p className={`text-xs font-semibold ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>{card.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
