# Documentation des Endpoints de l'API - MediBloc Backend

## 1. Vue d'Ensemble

L'API MediBloc expose une double interface standardisee :
1. **Interface RESTful** accessible sous le prefixe `/api/v1`
2. **Interface GraphQL** accessible sous le point de terminaison `/graphql`

Documentation interactive Swagger disponible sur `/api-docs`.

---

## 2. Structure Standard des Reponses

### Succes
```json
{
  "success": true,
  "data": {},
  "message": "Operation realisee avec succes"
}
```

### Erreur
```json
{
  "success": false,
  "message": "Message d'erreur explicite",
  "errors": []
}
```

---

## 3. Sommaire des Domaines REST (/api/v1)

- `/auth` : Authentification, sessions, renouvellement de jetons.
- `/users` : Comptes utilisateurs, profils et parametrages.
- `/patients` : Dossiers administratifs patients, pathologies associees.
- `/doctors` : Annuaire des praticiens, disponibilites, conges.
- `/appointments` : Prise, modification et annulation de rendez-vous.
- `/medical-records` : Dossiers medicaux et observations cliniques.
- `/prescriptions` : Ordonnances et posologies medicales.
- `/diseases` : Nomenclature des maladies et prevelances.
- `/symptoms` : Repertoire des symptomes.
- `/pharmacies` : Annuaire des officines de dispensation.
- `/medicines` : Catalogue des medicaments pharmaceutiques et plantes medicinales.
- `/invoices` : Facturation des actes medicaux.
- `/discussions` : Messagerie securisee praticien / patient.
- `/notifications` : Flux des alertes et rappels de rendez-vous.
- `/reviews` : Retours d'experience et evaluations des soins.
- `/hotspots` : Surveillance epidemiologique internationale.
- `/stats` : Agregats statistiques et indicateurs d'activite.
- `/health` : Etat operationnel de l'API.

---

## 4. Interface GraphQL (/graphql)

Le point d'entree GraphQL permet d'executer des requetes et mutations ciblees couvrant l'ensemble des modules metiers de maniere independante.
