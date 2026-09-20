import type { IconType } from 'react-icons';
import {
  FiActivity,
  FiAward,
  FiShield,
  FiZap,
} from 'react-icons/fi';
import {
  RiBrainLine,
  RiHeartPulseLine,
  RiLungsLine,
  RiStethoscopeLine,
} from 'react-icons/ri';

export interface HospitalDepartment {
  readonly id: string;
  readonly title: string;
  readonly desc: string;
  readonly icon: IconType;
}

export const HOSPITAL_DEPARTMENTS: readonly HospitalDepartment[] = [
  {
    id: 'cardiology',
    title: 'Cardiology',
    desc: 'Comprehensive heart care including angioplasty, ecg, and bypass surgery.',
    icon: RiHeartPulseLine,
  },
  {
    id: 'neurology',
    title: 'Neurology',
    desc: 'Diagnosis and treatment of brain, nerve, and spinal conditions.',
    icon: RiBrainLine,
  },
  {
    id: 'orthopedics',
    title: 'Orthopedics',
    desc: 'Bone and joint care: fractures, arthritis, joint replacement & rehab.',
    icon: FiZap,
  },
  {
    id: 'gastroenterology',
    title: 'Gastroenterology',
    desc: 'Expert care for digestive system, liver, and pancreas disorders.',
    icon: FiShield,
  },
  {
    id: 'pediatrics',
    title: 'Pediatrics',
    desc: 'Medical services for infants, children, and adolescents.',
    icon: FiActivity,
  },
  {
    id: 'gynecology',
    title: 'Gynecology & Obstetrics',
    desc: "Women's health, pregnancy care, and childbirth services.",
    icon: RiStethoscopeLine,
  },
  {
    id: 'urology',
    title: 'Urology',
    desc: 'Advanced kidney, bladder, and male reproductive treatments.',
    icon: FiAward,
  },
  {
    id: 'radiology',
    title: 'Radiology',
    desc: 'High-tech imaging services including mri, ct scan, and x-ray.',
    icon: RiLungsLine,
  },
] as const;
