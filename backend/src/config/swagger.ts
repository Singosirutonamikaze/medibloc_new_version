import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MediBloc API",
      version: "1.0.0",
      description: "API documentation for MediBloc backend",
      contact: {
        name: "MediBloc Support",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "Production server",
      },
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Bearer token",
        },
      },
      schemas: {
        // User Schemas
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email",
            },
            firstName: {
              type: "string",
              description: "User first name",
            },
            lastName: {
              type: "string",
              description: "User last name",
            },
            role: {
              type: "string",
              enum: ["PATIENT", "DOCTOR", "PHARMACY", "ADMIN"],
              description: "User role",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation date",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update date",
            },
          },
          required: ["id", "email", "firstName", "lastName", "role"],
        },

        RegisterUserDto: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              description: "User password (min 8 characters)",
            },
            firstName: {
              type: "string",
              description: "User first name",
            },
            lastName: {
              type: "string",
              description: "User last name",
            },
            role: {
              type: "string",
              enum: ["PATIENT", "DOCTOR", "PHARMACY", "ADMIN"],
              description: "User role",
            },
          },
          required: ["email", "password", "firstName", "lastName"],
        },

        LoginDto: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email",
            },
            password: {
              type: "string",
              format: "password",
              description: "User password",
            },
          },
          required: ["email", "password"],
        },

        AuthResponse: {
          type: "object",
          properties: {
            user: {
              $ref: "#/components/schemas/User",
            },
            token: {
              type: "string",
              description: "JWT token",
            },
          },
          required: ["user", "token"],
        },

        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Request success status",
            },
            data: {
              type: "object",
              nullable: true,
              description: "Response data",
            },
            message: {
              type: "string",
              description: "Success message",
            },
            error: {
              type: "string",
              description: "Error message",
            },
          },
          required: ["success"],
        },

        // Appointment Schemas
        Appointment: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Appointment ID",
            },
            patientId: {
              type: "integer",
              description: "Patient ID",
            },
            doctorId: {
              type: "integer",
              description: "Doctor ID",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Appointment date and time",
            },
            reason: {
              type: "string",
              description: "Reason for appointment",
            },
            status: {
              type: "string",
              enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
              description: "Appointment status",
            },
            notes: {
              type: "string",
              nullable: true,
              description: "Additional notes",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["id", "patientId", "doctorId", "date", "reason", "status"],
        },

        // Doctor Schemas
        Doctor: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Doctor ID",
            },
            userId: {
              type: "integer",
              description: "Associated user ID",
            },
            specialization: {
              type: "string",
              description: "Doctor specialization",
            },
            licenseNumber: {
              type: "string",
              description: "Medical license number",
            },
            phone: {
              type: "string",
              description: "Contact phone",
            },
            address: {
              type: "string",
              description: "Clinic address",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Pharmacy Schemas
        Pharmacy: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Pharmacy ID",
            },
            userId: {
              type: "integer",
              description: "Associated user ID",
            },
            name: {
              type: "string",
              description: "Pharmacy name",
            },
            licenseNumber: {
              type: "string",
              description: "License number",
            },
            phone: {
              type: "string",
              description: "Contact phone",
            },
            address: {
              type: "string",
              description: "Pharmacy address",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Patient Schemas
        Patient: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Patient ID",
            },
            userId: {
              type: "integer",
              description: "Associated user ID",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              description: "Date of birth",
            },
            gender: {
              type: "string",
              enum: ["MALE", "FEMALE", "OTHER"],
            },
            phone: {
              type: "string",
              description: "Contact phone",
            },
            address: {
              type: "string",
              description: "Home address",
            },
            bloodType: {
              type: "string",
              enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
            },
            allergies: {
              type: "string",
              nullable: true,
              description: "Known allergies",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Medicine Schemas
        Medicine: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            name: {
              type: "string",
              description: "Medicine name",
            },
            dosage: {
              type: "string",
              description: "Dosage information",
            },
            price: {
              type: "number",
              format: "decimal",
              description: "Medicine price",
            },
            pharmacyId: {
              type: "integer",
              description: "pharmacy ID",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Prescription Schemas
        Prescription: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            patientId: {
              type: "integer",
              description: "Patient ID",
            },
            doctorId: {
              type: "integer",
              description: "Doctor ID",
            },
            medicineId: {
              type: "integer",
              description: "Medicine ID",
            },
            dosage: {
              type: "string",
              description: "Prescribed dosage",
            },
            frequency: {
              type: "string",
              description: "Frequency of intake",
            },
            duration: {
              type: "string",
              description: "Duration of treatment",
            },
            notes: {
              type: "string",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Medical Record Schemas
        MedicalRecord: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            patientId: {
              type: "integer",
              description: "Patient ID",
            },
            doctorId: {
              type: "integer",
              description: "Doctor ID",
            },
            diagnosis: {
              type: "string",
              description: "Diagnosis",
            },
            treatment: {
              type: "string",
              description: "Treatment plan",
            },
            notes: {
              type: "string",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              description: "Error message",
            },
          },
          required: ["success", "error"],
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
});

export { swaggerSpec };
