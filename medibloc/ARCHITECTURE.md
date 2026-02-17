# Architecture Frontend MediBloc

## Structure du projet

```text
src/
├── components/           # Composants reutilisables
│   ├── atoms/            # Composants de base
│   ├── molecules/        # Composants combines
│   ├── organisms/        # Composants complexes
│   ├── common/           # Composants communs
│   ├── layout/           # Layouts
│   └── guards/           # Protection des routes
│
├── contexts/             # Contextes React
│   ├── AuthContext/
│   ├── ThemeContext/
│   └── NotificationContext/
│
├── hooks/                # Hooks personnalises par domaine
│   ├── useAuth/
│   ├── useTheme/
│   ├── useNotification/
│   ├── useApi/
│   ├── useUsers/
│   ├── usePatients/
│   ├── useDoctors/
│   ├── useAppointments/
│   ├── useDiseases/
│   ├── useSymptoms/
│   ├── useMedicines/
│   ├── usePharmacies/
│   ├── usePrescriptions/
│   ├── useMedicalRecords/
│   └── useStats/
│
├── pages/                # Pages par role
│   ├── [admin]/
│   ├── [docteur]/
│   ├── [patient]/
│   ├── auth/
│   ├── home/
│   └── not-found/
│
├── routes/               # Configuration des routes
│   ├── Routes.tsx
│   ├── AppRouter.tsx
│   └── index.ts
│
├── services/             # Services API par domaine
│   ├── api/
│   └── storage/
│
├── types/                # Types TypeScript par domaine
│   ├── common/
│   ├── auth/
│   ├── user/
│   ├── patient/
│   ├── doctor/
│   ├── appointment/
│   ├── disease/
│   ├── symptom/
│   ├── medicine/
│   ├── pharmacy/
│   ├── prescription/
│   ├── medical-record/
│   └── country/
│
└── utils/                # Utilitaires
    ├── api/
    ├── constants/
    ├── helpers/
    └── config/
```

## Principes d'organisation

1. Chaque domaine possede un dossier dedie pour les types, services et hooks.
2. Chaque dossier exporte ses elements via un fichier `index.ts`.
3. Les constantes respectent une notation en majuscules pour la lisibilite.
4. La structure reflechi les entites du backend et facilite la navigation.

## Exemple d'utilisation

```typescript
import { patientsService, doctorsService } from '@/services';
import type { Patient, Doctor, Appointment } from '@/types';
import { useAuth, useNotification } from '@/hooks';

const MyComponent = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const fetchPatients = async () => {
    try {
      const patients = await patientsService.getAll();
      void patients;
    } catch (error) {
      addNotification('error', 'Erreur lors du chargement');
    }
  };

  void user;
  void fetchPatients;

  return null;
};
```
