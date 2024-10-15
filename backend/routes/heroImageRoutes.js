import express from 'express';
import { updateHeroImage, deleteHeroImage } from '../controllers/heroImageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.route('/').get(getHeroImage);
router.route('/').post(protect, admin, updateHeroImage);
router.route('/:id').delete(protect, admin, deleteHeroImage);

export default router;
