import type { OpenAPIV3 } from "openapi-types";

export const swaggerSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "MediBloc API",
    version: "1.0.0",
    description: "API REST et GraphQL pour la plateforme médicale MediBloc",
    contact: {
      name: "MediBloc Tech Team",
    },
  },
  servers: [
    {
      url: "/api/v1",
      description: "Production Server",
    },
    {
      url: "http://localhost:3000/api/v1",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Entrez votre jeton JWT Bearer",
      },
    },
    schemas: {
      // Reponse standard
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "object", nullable: true },
          message: { type: "string" },
        },
        required: ["success"],
      },
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          errors: {
            type: "array",
            items: { type: "object" },
          },
        },
        required: ["success", "message"],
      },

      // Utilisateur & Authentification
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          email: {
            type: "string",
            format: "email",
            example: "patient@medibloc.com",
          },
          firstName: { type: "string", example: "Jean" },
          lastName: { type: "string", example: "Dupont" },
          role: {
            type: "string",
            enum: ["PATIENT", "DOCTOR", "ADMIN"],
            example: "PATIENT",
          },
          avatarUrl: { type: "string", nullable: true },
          isEmailVerified: { type: "boolean", example: false },
          twoFactorEnabled: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "email", "firstName", "lastName", "role"],
      },
      RegisterDto: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          firstName: { type: "string" },
          lastName: { type: "string" },
          role: {
            type: "string",
            enum: ["PATIENT", "DOCTOR", "ADMIN"],
            default: "PATIENT",
          },
        },
        required: ["email", "password", "firstName", "lastName"],
      },
      LoginDto: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
        required: ["email", "password"],
      },
      AuthResponseData: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string" },
          refreshToken: { type: "string" },
        },
        required: ["user", "token"],
      },

      // Patient
      Patient: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          birthDate: { type: "string", format: "date-time", nullable: true },
          gender: {
            type: "string",
            enum: ["MALE", "FEMALE", "OTHER"],
            nullable: true,
          },
          phone: { type: "string", nullable: true },
          address: { type: "string", nullable: true },
          user: { $ref: "#/components/schemas/User" },
        },
        required: ["id", "userId"],
      },

      // Medecin
      Doctor: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          specialty: { type: "string", nullable: true },
          phone: { type: "string", nullable: true },
          user: { $ref: "#/components/schemas/User" },
        },
        required: ["id", "userId"],
      },

      // Rendez-vous
      Appointment: {
        type: "object",
        properties: {
          id: { type: "integer" },
          patientId: { type: "integer" },
          doctorId: { type: "integer" },
          scheduledAt: { type: "string", format: "date-time" },
          reason: { type: "string", nullable: true },
          notes: { type: "string", nullable: true },
          status: {
            type: "string",
            enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "patientId", "doctorId", "scheduledAt", "status"],
      },

      // Prescriptions
      Prescription: {
        type: "object",
        properties: {
          id: { type: "integer" },
          doctorId: { type: "integer" },
          patientId: { type: "integer" },
          medications: { type: "string" },
          diagnosis: { type: "string", nullable: true },
          notes: { type: "string", nullable: true },
          issuedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "doctorId", "patientId", "medications"],
      },

      // Dossier Medical
      MedicalRecord: {
        type: "object",
        properties: {
          id: { type: "integer" },
          patientId: { type: "integer" },
          title: { type: "string" },
          content: { type: "string" },
          files: { type: "array", items: { type: "string" } },
          createdAt: { type: "string", format: "date-time" },
        },
        required: ["id", "patientId", "title", "content"],
      },

      // Medicament & Pharmacie
      Medicine: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          type: { type: "string", enum: ["PHARMACEUTICAL", "HERBAL"] },
          description: { type: "string", nullable: true },
          composition: { type: "string", nullable: true },
          scientificName: { type: "string", nullable: true },
          commonNames: { type: "array", items: { type: "string" } },
          pharmacyId: { type: "integer", nullable: true },
          sideEffects: { type: "array", items: { type: "string" } },
          contraindications: { type: "array", items: { type: "string" } },
        },
        required: ["id", "name", "type"],
      },
      Pharmacy: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
          countryId: { type: "integer" },
          phone: { type: "string", nullable: true },
          email: { type: "string", nullable: true },
        },
        required: ["id", "name", "address", "city", "countryId"],
      },

      // Maladies & Symptomes
      Disease: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          isViral: { type: "boolean" },
          isBacterial: { type: "boolean" },
          isGenetic: { type: "boolean" },
          isChronic: { type: "boolean" },
        },
        required: ["id", "name"],
      },
      Symptom: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
        },
        required: ["id", "name"],
      },

      // Factures & Paiements
      Invoice: {
        type: "object",
        properties: {
          id: { type: "integer" },
          appointmentId: { type: "integer" },
          patientId: { type: "integer" },
          amount: { type: "number" },
          currency: { type: "string", default: "XOF" },
          status: {
            type: "string",
            enum: [
              "PENDING",
              "PAID",
              "PARTIALLY_PAID",
              "CANCELLED",
              "REFUNDED",
            ],
          },
        },
        required: ["id", "appointmentId", "patientId", "amount", "status"],
      },

      // Discussions & Messages
      Discussion: {
        type: "object",
        properties: {
          id: { type: "integer" },
          patientId: { type: "integer" },
          doctorId: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
        },
        required: ["id", "patientId", "doctorId"],
      },
      Message: {
        type: "object",
        properties: {
          id: { type: "integer" },
          discussionId: { type: "integer" },
          senderRole: { type: "string", enum: ["PATIENT", "DOCTOR", "ADMIN"] },
          content: { type: "string", nullable: true },
          fileUrl: { type: "string", nullable: true },
          isRead: { type: "boolean" },
          sentAt: { type: "string", format: "date-time" },
        },
        required: ["id", "discussionId", "senderRole"],
      },

      // Statistiques
      DashboardStats: {
        type: "object",
        properties: {
          totalUsers: { type: "integer" },
          totalPatients: { type: "integer" },
          totalDoctors: { type: "integer" },
          totalAppointments: { type: "integer" },
          pendingAppointments: { type: "integer" },
          completedAppointments: { type: "integer" },
          totalPrescriptions: { type: "integer" },
          totalInvoicesAmount: { type: "number" },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Verification de l'etat de l'API",
        security: [],
        responses: {
          "200": {
            description: "API en fonctionnement",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },

    // Authentification (Public)
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Inscription d'un utilisateur",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterDto" },
            },
          },
        },
        responses: {
          "201": {
            description: "Utilisateur cree avec succes",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          "400": { description: "Donnees invalides" },
          "409": { description: "Email deja utilise" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Connexion d'un utilisateur",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginDto" },
            },
          },
        },
        responses: {
          "200": {
            description: "Connexion reussie, token JWT genere",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          "401": { description: "Identifiants incorrects" },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Obtenir le profil de l'utilisateur connecte",
        responses: {
          "200": {
            description: "Profil recupere",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          "401": { description: "Non authentifie" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Deconnexion de l'utilisateur",
        responses: {
          "200": { description: "Deconnexion reussie" },
        },
      },
    },

    // Epi-Surveillance / Hotspots (Public)
    "/hotspots": {
      get: {
        tags: ["Hotspots"],
        summary: "Recuperer les zones d'alertes epidemiologiques",
        security: [],
        responses: {
          "200": {
            description: "Liste des foyers epidemiologiques",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },

    // Patients
    "/patients": {
      get: {
        tags: ["Patients"],
        summary: "Lister les patients",
        responses: {
          "200": {
            description: "Liste des patients",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Patients"],
        summary: "Creer un profil patient",
        responses: {
          "201": { description: "Patient cree" },
        },
      },
    },
    "/patients/{id}": {
      get: {
        tags: ["Patients"],
        summary: "Recuperer un patient par son identifiant",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Detail du patient" },
          "404": { description: "Patient non trouve" },
        },
      },
      put: {
        tags: ["Patients"],
        summary: "Mettre a jour un patient",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Patient mis a jour" },
        },
      },
      delete: {
        tags: ["Patients"],
        summary: "Supprimer un patient",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Patient supprime" },
        },
      },
    },

    // Medecins
    "/doctors": {
      get: {
        tags: ["Doctors"],
        summary: "Lister les medecins",
        responses: {
          "200": { description: "Liste des medecins" },
        },
      },
      post: {
        tags: ["Doctors"],
        summary: "Creer un medecin",
        responses: {
          "201": { description: "Medecin cree" },
        },
      },
    },
    "/doctors/{id}": {
      get: {
        tags: ["Doctors"],
        summary: "Obtenir le profil d'un medecin",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Detail du medecin" },
          "404": { description: "Medecin introuvable" },
        },
      },
    },

    // Rendez-vous
    "/appointments": {
      get: {
        tags: ["Appointments"],
        summary: "Lister les rendez-vous",
        responses: {
          "200": { description: "Liste des rendez-vous" },
        },
      },
      post: {
        tags: ["Appointments"],
        summary: "Planifier un nouveau rendez-vous",
        responses: {
          "201": { description: "Rendez-vous cree" },
        },
      },
    },
    "/appointments/{id}": {
      get: {
        tags: ["Appointments"],
        summary: "Obtenir les details d'un rendez-vous",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Detail du rendez-vous" },
        },
      },
      put: {
        tags: ["Appointments"],
        summary: "Modifier le statut ou la date du rendez-vous",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Rendez-vous modifie" },
        },
      },
      delete: {
        tags: ["Appointments"],
        summary: "Annuler un rendez-vous",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Rendez-vous annule" },
        },
      },
    },

    // Prescriptions
    "/prescriptions": {
      get: {
        tags: ["Prescriptions"],
        summary: "Lister les ordonnances",
        responses: { "200": { description: "Liste des prescriptions" } },
      },
      post: {
        tags: ["Prescriptions"],
        summary: "Creer une ordonnance",
        responses: { "201": { description: "Prescription emise" } },
      },
    },

    // Dossiers medicaux
    "/medical-records": {
      get: {
        tags: ["Medical Records"],
        summary: "Lister les dossiers medicaux",
        responses: { "200": { description: "Liste des dossiers" } },
      },
      post: {
        tags: ["Medical Records"],
        summary: "Ajouter une entree au dossier medical",
        responses: { "201": { description: "Entree ajoutee" } },
      },
    },

    // Statistiques REST
    "/stats": {
      get: {
        tags: ["Stats"],
        summary: "Statistiques globales du tableau de bord",
        responses: {
          "200": {
            description: "Indicateurs du tableau de bord",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },
  },
};
