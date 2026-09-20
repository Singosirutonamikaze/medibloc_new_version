import { FiActivity, FiCalendar, FiFileText, FiLock, FiShield, FiUsers } from 'react-icons/fi';

const services = [
  {
    Icon: FiLock,
    title: 'Role-Based Secure Access',
    desc: 'Each practitioner and patient accesses only the records and actions pertinent to their role.',
  },
  {
    Icon: FiUsers,
    title: 'Centralized Patient & Doctor Profiles',
    desc: 'Consult all vital health records, diagnostics, and clinical history in one intuitive dashboard.',
  },
  {
    Icon: FiCalendar,
    title: 'Seamless Appointment Scheduling',
    desc: 'Real-time consultation bookings, automated reminders, and optimized clinical schedules.',
  },
  {
    Icon: FiFileText,
    title: 'Structured Medical Records',
    desc: 'High-precision diagnoses, 3D anatomical scans, treatment notes, and comprehensive history.',
  },
  {
    Icon: FiShield,
    title: 'E-Prescriptions & Pharmacy Tracking',
    desc: 'Direct connection between prescriptions, dosages, and pharmacy dispensing for absolute safety.',
  },
  {
    Icon: FiActivity,
    title: 'Clinical Analytics & Real-Time KPIs',
    desc: 'Track hospital performance, patient outcomes, and diagnostic accuracy with live data.',
  },
] as const;

export const ServiceSection = () => {
  return (
    <section className="w-full">
      <div className="mb-10">
        <span className="inline-flex rounded-full bg-[#7ED957]/15 px-4 py-1.5 text-xs font-bold text-[#0B2545]">
          Core Capabilities
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B2545] sm:text-4xl">
          Everything you can achieve with <span className="text-[#0B2545]">Medi</span><span className="text-[#7ED957]">Bloc</span>
        </h2>
        <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-[#6B7280]">
          Our hospital platform centralizes cutting-edge diagnostics, patient management, and collaborative clinical workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map(({ Icon, title, desc }) => (
          <article
            key={title}
            className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_8px_30px_rgba(11,37,69,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(11,37,69,0.12)]"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FB] text-[#0B2545] transition-transform duration-300 group-hover:scale-110">
              <Icon className="text-xl text-[#0B2545]" />
            </div>
            <h3 className="text-base font-bold text-[#0B2545]">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
