import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; 

const router = express.Router();


router.get('/', getAllProducts);
router.get('/:id', getProductById);


router.post('/', protect, admin, upload.single('image'), createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/upload', protect, admin, upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

export default router;
