/**
 * @file appointment.schema.ts
 * @description Schema GraphQL SDL pour les rendez-vous medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const appointmentTypeDefs = `#graphql
  enum AppointmentStatus {
    PENDING
    CONFIRMED
    CANCELLED
    COMPLETED
  }

  type Appointment {
    id: Int!
    patientId: Int!
    doctorId: Int!
    scheduledAt: String!
    reason: String
    notes: String
    status: AppointmentStatus!
    createdAt: String!
    updatedAt: String!
  }

  input CreateAppointmentInput {
    patientId: Int!
    doctorId: Int!
    scheduledAt: String!
    reason: String
    notes: String
  }

  input UpdateAppointmentInput {
    scheduledAt: String
    reason: String
    notes: String
    status: AppointmentStatus
  }

  extend type Query {
    appointments: [Appointment!]!
    appointment(id: Int!): Appointment
    patientAppointments(patientId: Int!): [Appointment!]!
    doctorAppointments(doctorId: Int!): [Appointment!]!
  }

  extend type Mutation {
    createAppointment(input: CreateAppointmentInput!): Appointment!
    updateAppointment(id: Int!, input: UpdateAppointmentInput!): Appointment!
    updateAppointmentStatus(id: Int!, status: AppointmentStatus!): Appointment!
    deleteAppointment(id: Int!): Appointment!
  }
`;
