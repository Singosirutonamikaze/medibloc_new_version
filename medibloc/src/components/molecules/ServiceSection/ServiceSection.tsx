import { useNavigate } from 'react-router-dom';
import {
  FiActivity,
  FiArrowUpRight,
  FiCalendar,
  FiCheck,
  FiFileText,
  FiShield,
  FiUsers,
  FiVideo,
} from 'react-icons/fi';
import { ROUTES } from '../../../utils/constants/routes.constants';

const services = [
  {
    Icon: FiVideo,
    title: 'Virtual Consultations & Telehealth',
    desc: 'Consult certified medical specialists remotely via high-definition secure video from home and receive digital prescriptions instantly.',
    path: ROUTES.PUBLIC.REGISTER,
    badge: 'Telehealth',
  },
  {
    Icon: FiUsers,
    title: 'Centralized Patient & Doctor Profiles',
    desc: 'Consult all vital health records, diagnostics, and clinical history in one intuitive dashboard.',
    path: ROUTES.PUBLIC.REGISTER,
    badge: 'Profiles',
  },
  {
    Icon: FiCalendar,
    title: 'Seamless Appointment Scheduling',
    desc: 'Real-time consultation bookings, automated reminders, and optimized clinical schedules.',
    path: ROUTES.PUBLIC.REGISTER,
    badge: 'Appointments',
  },
  {
    Icon: FiFileText,
    title: 'Structured Medical Records',
    desc: 'High-precision diagnoses, 3D anatomical scans, treatment notes, and comprehensive history.',
    path: ROUTES.PUBLIC.LOGIN,
    badge: 'Records',
  },
  {
    Icon: FiShield,
    title: 'E-Prescriptions & Pharmacy Tracking',
    desc: 'Direct connection between prescriptions, dosages, and pharmacy dispensing for absolute safety.',
    path: ROUTES.PUBLIC.LOGIN,
    badge: 'Pharmacy',
  },
  {
    Icon: FiActivity,
    title: 'Clinical Analytics & Real-Time KPIs',
    desc: 'Track hospital performance, patient outcomes, and diagnostic accuracy with live data.',
    path: ROUTES.PUBLIC.LOGIN,
    badge: 'Analytics',
  },
] as const;

export const ServiceSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full">
      <div className="mb-10">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D6E4F0]/60 bg-white/80 px-4 py-1.5 text-xs font-bold text-[#0B2545] shadow-[0_2px_10px_rgba(11,37,69,0.05)] backdrop-blur-md">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7ED957]/15 text-[#7ED957]">
            <FiCheck className="h-3 w-3 text-[#12315C]" />
          </span>
          <span>Core Capabilities</span>
        </div>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B2545] sm:text-4xl">
          Everything you can achieve with <span className="text-[#0B2545]">Medi</span><span className="text-[#7ED957]">Bloc</span>
        </h2>
        <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-[#6B7280]">
          Our hospital platform centralizes cutting-edge diagnostics, patient management, and collaborative clinical workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map(({ Icon, title, desc, path, badge }) => (
          <button
            key={title}
            type="button"
            onClick={() => navigate(path)}
            className="group relative flex cursor-pointer flex-col justify-between text-left rounded-3xl border border-[#E0EAF3]/60 bg-white/85 p-7 shadow-[0_8px_24px_rgba(11,37,69,0.06)] backdrop-blur-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#B8D6F0] hover:bg-white hover:shadow-[0_20px_40px_rgba(11,37,69,0.12)] focus:outline-none focus:ring-2 focus:ring-[#7ED957]"
          >
            <div className="w-full">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF3FB] text-[#0B2545] transition-transform duration-300 group-hover:scale-110">
                  <Icon className="text-xl text-[#0B2545]" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#EAF3FB] px-2.5 py-1 text-[11px] font-semibold text-[#0B2545] transition-colors group-hover:bg-[#7ED957]/20">
                    {badge}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7ED957] text-[#0B2545] shadow-xs transition-transform duration-300 group-hover:scale-110">
                    <FiArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
              <div className="mt-5">
                <h3 className="text-base font-bold text-[#0B2545] transition-colors group-hover:text-[#12315C]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{desc}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#0B2545] transition-colors group-hover:text-[#12315C]">
              <span>Access service</span>
              <FiArrowUpRight className="h-3.5 w-3.5 text-[#7ED957] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
