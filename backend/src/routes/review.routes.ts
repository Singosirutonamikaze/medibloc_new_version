import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware, validationSchemas } from '../middleware/validation.middleware';

const router = Router();
const controller = new ReviewController();

router.use(authMiddleware);

router.get('/', controller.getAllReviews);

router.post(
  '/',
  validationMiddleware(validationSchemas.createReview),
  controller.createReview
);

router.get('/doctor/:doctorId', controller.getDoctorReviews);

router.get('/patient/:patientId', controller.getPatientReviews);

router.get('/:id', controller.getReviewById);

router.delete('/:id', controller.deleteReview);

export default router;
