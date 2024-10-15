
import express from 'express';
import { registerUser, authUser, getUserProfile, updateUserProfile, logoutUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/signup', registerUser); 
router.post('/login', authUser); 
router.post('/logout', logoutUser); 
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile); 

export default router;
