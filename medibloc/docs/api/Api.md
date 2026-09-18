# Integration de l'API Backend - MediBloc Web

## 1. Vue d'Ensemble des Communications

Le frontend interagit avec le backend MediBloc via :
- Une interface RESTful basee sur le prefixe `/api/v1`
- Un point d'acces GraphQL `/graphql` pour les requetes de donnees ciblees
- Une instance centralisee d'Axios configuree dans `src/utils/api/`

---

## 2. Format des Reponses et Gestion des Erreurs

### Format Standard de Reponse API
```typescript
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string;
  readonly errors?: readonly string[];
}
```

### Gestion des Erreurs Reseau et Metier
L'intercepteur Axios intercepte les reponses en erreur et normalise le message destine a l'utilisateur :
- `401 Unauthorized` : Redirection automatique vers la page de connexion (`/auth/login`).
- `403 Forbidden` : Notification d'acces refuse.
- `404 Not Found` : Notification de ressource introuvable.
- `500 Internal Server Error` : Notification d'indisponibilite du service.

---

## 3. Sommaire des Services API Client (`src/services/api/`)

- `appointments.service.ts` : Prise et gestion des rendez-vous medicaux.
- `auth.service.ts` : Connexion, inscription et rafraichissement de session.
- `discussions.service.ts` : Messagerie et echanges de messages.
- `diseases.service.ts` : Nomenclature des maladies.
- `doctors.service.ts` : Annuaire des medecins praticiens.
- `hotspots.service.ts` : Donnees de surveillance epidemiologique.
- `invoices.service.ts` : Facturation et reglements d'actes.
- `medical-records.service.ts` : Dossiers medicaux et observations cliniques.
- `medicines.service.ts` : Catalogue de medicaments et plantes.
- `notifications.service.ts` : Alertes et notifications en temps reel.
- `patients.service.ts` : Profils administratifs des patients.
- `pharmacies.service.ts` : Annuaire des pharmacies partenaires.
- `prescriptions.service.ts` : Ordonnances medicales.
- `reviews.service.ts` : Avis et evaluations des soins.
- `stats.service.ts` : Indicateurs et statistiques des tableaux de bord.
- `symptoms.service.ts` : Repertoire des symptomes.
- `users.service.ts` : Profils utilisateurs et parametres de compte.
