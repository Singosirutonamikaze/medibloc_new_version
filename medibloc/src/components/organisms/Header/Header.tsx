import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiChevronDown } from 'react-icons/fi';
import { ROUTES } from '../../../utils/constants/routes.constants';
import { HOSPITAL_DEPARTMENTS } from '../../../utils/constants/header.constants';
import logo from '../../../assets/logo/logo.png';

export const Header = () => {
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsDepartmentsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDepartmentsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleNavigate = (path: string) => {
    setIsDepartmentsOpen(false);
    navigate(path);
  };

  return (
    <header className="relative z-50 w-full bg-transparent">
      <div className="mx-auto flex h-20 w-full max-w-360 items-center justify-between px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => handleNavigate(ROUTES.PUBLIC.HOME)}
          className="flex items-center gap-2.5 cursor-pointer select-none bg-transparent border-none p-0 text-left focus:outline-hidden"
        >
          <img
            src={logo}
            alt="MediBloc"
            className="h-8 w-auto object-contain"
          />
          <span className="text-xl font-black tracking-tight text-[#0B2545]">
            Medi<span className="text-[#0B2545]">Bloc</span>
          </span>
        </button>

        <nav className="hidden items-center gap-2 text-sm font-semibold text-[#6B7280] md:flex">
          <button
            type="button"
            onClick={() => handleNavigate(ROUTES.PUBLIC.HOME)}
            className="rounded-full px-4 py-2 font-bold text-[#0B2545] transition-colors hover:bg-white/60"
          >
            Home
          </button>
          <a
            href="#about"
            className="rounded-full px-4 py-2 transition-colors hover:bg-white/60 hover:text-[#0B2545]"
          >
            About
          </a>

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsDepartmentsOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 transition-all ${
                isDepartmentsOpen
                  ? 'bg-white text-[#0B2545] shadow-sm'
                  : 'hover:bg-white/60 hover:text-[#0B2545]'
              }`}
            >
              <span>Departments</span>
              <FiChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isDepartmentsOpen ? 'rotate-180 text-[#0B2545]' : 'text-[#6B7280]'
                }`}
              />
            </button>

            {isDepartmentsOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[min(92vw,780px)] rounded-3xl border border-white/90 bg-white/95 p-6 shadow-[0_25px_60px_rgba(11,37,69,0.18)] backdrop-blur-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-[#0B2545]">
                      Specialized Medical Departments
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      MediBloc offers a full range of specialized medical services and clinical excellence
                    </p>
                  </div>
                  <a
                    href="#services"
                    onClick={() => setIsDepartmentsOpen(false)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0B2545] hover:text-[#12315C]"
                  >
                    <span>All Departments</span>
                    <FiArrowUpRight className="h-3.5 w-3.5 text-[#7ED957]" />
                  </a>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {HOSPITAL_DEPARTMENTS.map((dept) => {
                    const IconComponent = dept.icon;
                    return (
                      <a
                        key={dept.id}
                        href="#services"
                        onClick={() => setIsDepartmentsOpen(false)}
                        className="group flex items-start gap-3 rounded-2xl p-3 transition-all duration-200 hover:bg-[#EAF3FB]/80"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3FB] text-[#0B2545] transition-transform duration-200 group-hover:scale-110 group-hover:bg-white">
                          <IconComponent className="h-5 w-5 text-[#0B2545]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-[#0B2545] group-hover:text-[#12315C]">
                              {dept.title}
                            </h4>
                            <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-[#7ED957]">
                              <FiArrowUpRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-[#6B7280]">
                            {dept.desc}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <a
            href="#doctors"
            className="rounded-full px-4 py-2 transition-colors hover:bg-white/60 hover:text-[#0B2545]"
          >
            Doctors
          </a>
          <a
            href="#experience"
            className="rounded-full px-4 py-2 transition-colors hover:bg-white/60 hover:text-[#0B2545]"
          >
            Career
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavigate(ROUTES.PUBLIC.REGISTER)}
            className="group inline-flex items-center gap-3 rounded-full bg-[#0B2545] pl-6 pr-2 py-2 text-xs font-bold text-white shadow-[0_8px_20px_rgba(11,37,69,0.2)] transition-all duration-300 hover:bg-[#12315C] hover:shadow-[0_12px_28px_rgba(11,37,69,0.3)]"
          >
            <span>Contact Us</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7ED957] text-xs font-black text-[#0B2545] transition-transform duration-300 group-hover:scale-110">
              <FiArrowUpRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
