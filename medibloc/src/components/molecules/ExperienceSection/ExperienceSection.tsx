import { FiActivity, FiShield, FiUsers } from 'react-icons/fi';

export const ExperienceSection = () => {
  return (
    <section className="w-full">
      <div className="mb-10">
        <span className="inline-flex rounded-full bg-[#7ED957]/15 px-4 py-1.5 text-xs font-bold text-[#0B2545]">
          Practitioner & Patient Experience
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B2545] sm:text-4xl">
          Engineered to be <span className="text-[#0B2545]">seamless</span> and <span className="text-[#0B2545]">intuitive</span> from day one
        </h2>
        <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-[#6B7280]">
          Immediate adoption without complex training, designed for doctors, specialists, and patients alike.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_8px_30px_rgba(11,37,69,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(11,37,69,0.12)]">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FB] text-[#0B2545] transition-transform duration-300 group-hover:scale-110">
              <FiActivity className="text-xl text-[#0B2545]" />
            </div>
            <h3 className="text-base font-bold text-[#0B2545]">Instant Clinical Productivity</h3>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
            Core workflows including consultations, diagnostics, and prescriptions are accessible in one click.
          </p>
        </article>

        <article className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_8px_30px_rgba(11,37,69,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(11,37,69,0.12)]">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FB] text-[#0B2545] transition-transform duration-300 group-hover:scale-110">
              <FiUsers className="text-xl text-[#0B2545]" />
            </div>
            <h3 className="text-base font-bold text-[#0B2545]">Dedicated Role Spaces</h3>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
            Tailored interfaces for chief medical officers, surgeons, nurses, and administrative staff.
          </p>
        </article>

        <article className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_8px_30px_rgba(11,37,69,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(11,37,69,0.12)]">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FB] text-[#0B2545] transition-transform duration-300 group-hover:scale-110">
              <FiShield className="text-xl text-[#0B2545]" />
            </div>
            <h3 className="text-base font-bold text-[#0B2545]">Hospital-Grade Data Security</h3>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
            End-to-end encryption for electronic health records, HIPAA & GDPR compliance with full auditability.
          </p>
        </article>
      </div>
    </section>
  );
};

