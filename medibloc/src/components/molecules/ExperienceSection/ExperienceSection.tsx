import { FiActivity, FiArrowUpRight, FiCheck, FiShield, FiUsers } from 'react-icons/fi';

export const ExperienceSection = () => {
  return (
    <section className="relative w-full">
      <div className="mb-10">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D6E4F0]/60 bg-white/80 px-4 py-1.5 text-xs font-bold text-[#0B2545] shadow-[0_2px_10px_rgba(11,37,69,0.05)] backdrop-blur-md">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7ED957]/15 text-[#7ED957]">
            <FiCheck className="h-3 w-3 text-[#12315C]" />
          </span>
          <span>Practitioner & Patient Experience</span>
        </div>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B2545] sm:text-4xl">
          Engineered to be <span className="text-[#0B2545]">seamless</span> and <span className="text-[#0B2545]">intuitive</span> from day one
        </h2>
        <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-[#6B7280]">
          Immediate adoption without complex training, designed for doctors, specialists, and patients alike.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="group relative flex flex-col justify-between rounded-3xl border border-[#E0EAF3]/60 bg-white/85 p-7 shadow-[0_8px_24px_rgba(11,37,69,0.06)] backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_36px_rgba(11,37,69,0.1)]">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF3FB] text-[#0B2545] transition-transform duration-300 group-hover:scale-110">
              <FiActivity className="text-xl text-[#0B2545]" />
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7ED957] text-[#0B2545] shadow-xs transition-transform duration-300 group-hover:scale-110">
              <FiArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-5">
            <h3 className="text-base font-bold text-[#0B2545]">Instant Clinical Productivity</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              Core workflows including consultations, diagnostics, and prescriptions are accessible in one click.
            </p>
          </div>
        </article>

        <article className="group relative flex flex-col justify-between rounded-3xl border border-[#E0EAF3]/60 bg-white/85 p-7 shadow-[0_8px_24px_rgba(11,37,69,0.06)] backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_36px_rgba(11,37,69,0.1)]">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF3FB] text-[#0B2545] transition-transform duration-300 group-hover:scale-110">
              <FiUsers className="text-xl text-[#0B2545]" />
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7ED957] text-[#0B2545] shadow-xs transition-transform duration-300 group-hover:scale-110">
              <FiArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-5">
            <h3 className="text-base font-bold text-[#0B2545]">Dedicated Role Spaces</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              Tailored interfaces for chief medical officers, surgeons, nurses, and administrative staff.
            </p>
          </div>
        </article>

        <article className="group relative flex flex-col justify-between rounded-3xl border border-[#E0EAF3]/60 bg-white/85 p-7 shadow-[0_8px_24px_rgba(11,37,69,0.06)] backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_36px_rgba(11,37,69,0.1)]">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF3FB] text-[#0B2545] transition-transform duration-300 group-hover:scale-110">
              <FiShield className="text-xl text-[#0B2545]" />
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7ED957] text-[#0B2545] shadow-xs transition-transform duration-300 group-hover:scale-110">
              <FiArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-5">
            <h3 className="text-base font-bold text-[#0B2545]">Hospital-Grade Data Security</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              End-to-end encryption for electronic health records, HIPAA & GDPR compliance with full auditability.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

