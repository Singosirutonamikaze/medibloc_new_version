/**
 * @file review.dto.ts
 * @description Objets de transfert de donnees pour les avis et evaluations de consultations.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export interface CreateReviewDto {
  readonly appointmentId: number;
  readonly patientId: number;
  readonly doctorId: number;
  readonly rating: number;
  readonly comment?: string;
}

export interface UpdateReviewDto {
  readonly rating?: number;
  readonly comment?: string;
}
