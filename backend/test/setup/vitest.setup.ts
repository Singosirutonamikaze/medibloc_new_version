import { vi } from 'vitest';

const createMockModel = (defaultItem: Record<string, unknown> = { id: 1 }) => ({
  findMany: vi.fn().mockResolvedValue([defaultItem]),
  findUnique: vi.fn().mockResolvedValue(defaultItem),
  findFirst: vi.fn().mockResolvedValue(defaultItem),
  create: vi.fn().mockImplementation((args: { data?: Record<string, unknown> }) =>
    Promise.resolve({ ...defaultItem, ...(args && args.data ? args.data : {}) })
  ),
  update: vi.fn().mockImplementation((args: { data?: Record<string, unknown> }) =>
    Promise.resolve({ ...defaultItem, ...(args && args.data ? args.data : {}) })
  ),
  delete: vi.fn().mockResolvedValue(defaultItem),
  count: vi.fn().mockResolvedValue(1),
  upsert: vi.fn().mockImplementation((args: { create?: Record<string, unknown> }) =>
    Promise.resolve({ ...defaultItem, ...(args && args.create ? args.create : {}) })
  ),
  updateMany: vi.fn().mockResolvedValue({ count: 1 }),
});

const mockPrismaInstance = {
  patient: createMockModel({
    id: 1,
    userId: 1,
    firstName: 'koffi',
    lastName: 'komla',
    email: 'koffi@example.com',
    user: { id: 1, firstName: 'koffi', lastName: 'komla', email: 'koffi@example.com' },
    patientDiseases: [],
    diseases: [],
    appointments: [],
    prescriptions: [],
  }),
  doctor: createMockModel({
    id: 1,
    userId: 2,
    specialty: 'Cardiologie',
    user: { id: 2, firstName: 'Dr', lastName: 'Martin', email: 'martin@example.com' },
    appointments: [],
    prescriptions: [],
    reviews: [],
  }),
  appointment: createMockModel({ id: 1, patientId: 1, doctorId: 1, date: new Date(), status: 'CONFIRMED' }),
  disease: createMockModel({ id: 1, name: 'Paludisme', description: 'Maladie parasitaire' }),
  symptom: createMockModel({ id: 1, name: 'Fievre', description: 'Elevation de temperature' }),
  medicine: createMockModel({ id: 1, name: 'Paracetamol', dosage: '500mg' }),
  pharmacy: createMockModel({ id: 1, name: 'Pharmacie Centrale', address: 'Abidjan', countryId: 1 }),
  prescription: createMockModel({ id: 1, patientId: 1, doctorId: 1, appointmentId: 1, items: [] }),
  medicalRecord: createMockModel({ id: 1, patientId: 1, doctorId: 1, diagnosis: 'Diagnostic', treatments: 'Traitement' }),
  user: createMockModel({
    id: 1,
    email: 'admin@medibloc.com',
    role: 'ADMIN',
    firstName: 'Admin',
    lastName: 'User',
    password: '$2a$10$hashedPasswordValueForTestUserMocking1234567890',
  }),
  diseaseSymptom: createMockModel({ id: 1, diseaseId: 1, symptomId: 1, symptom: { id: 1, name: 'Fievre' }, disease: { id: 1, name: 'Paludisme' } }),
  patientDisease: createMockModel({ id: 1, patientId: 1, diseaseId: 1, disease: { id: 1, name: 'Paludisme' } }),
  diseaseCountry: createMockModel({ id: 1, diseaseId: 1, countryId: 1, country: { id: 1, name: 'Cote dIvoire', code: 'CIV' } }),
  discussion: createMockModel({ id: 1, patientId: 1, doctorId: 1, messages: [] }),
  message: createMockModel({ id: 1, discussionId: 1, senderRole: 'PATIENT', content: 'Bonjour', isRead: false }),
  invoice: createMockModel({ id: 1, appointmentId: 1, patientId: 1, amount: 15000, status: 'PENDING', payments: [] }),
  payment: createMockModel({ id: 1, invoiceId: 1, amount: 15000, status: 'SUCCESS' }),
  notification: createMockModel({ id: 1, userId: 1, title: 'Notification', isRead: false }),
  review: createMockModel({ id: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Excellent' }),
  $transaction: vi.fn((callback: (prisma: unknown) => unknown) => callback(mockPrismaInstance)),
};


// Mock du module database pour le chemin standard core
vi.mock('../../src/core/configs/database/database.config', () => ({
  prisma: mockPrismaInstance,
  default: mockPrismaInstance,
}));

// Mock d'authentification pour autoriser les requêtes dans les tests d'intégration des routes
const mockAuthUser = {
  id: 1,
  email: 'admin@medibloc.com',
  role: 'ADMIN',
};

const passNext = (req: { user?: unknown }, _res: unknown, next: () => void) => {
  req.user = mockAuthUser;
  next();
};

vi.mock('../../src/core/middlewares/auth/auth.middleware', () => ({
  authMiddleware: vi.fn((req: { user?: unknown }, _res: unknown, next: () => void) => {
    req.user = mockAuthUser;
    next();
  }),
  requireRole: vi.fn(() => passNext),
  requireAdmin: vi.fn(passNext),
  requireDoctor: vi.fn(passNext),
  requirePatient: vi.fn(passNext),
  requireSameUserOrAdmin: vi.fn(passNext),
  requireDoctorSelfOrAdmin: vi.fn(passNext),
  requirePatientSelfOrAdmin: vi.fn(passNext),
  requireDoctorOfPatientOrAdmin: vi.fn(passNext),
  default: vi.fn((req: { user?: unknown }, _res: unknown, next: () => void) => {
    req.user = mockAuthUser;
    next();
  }),
}));
