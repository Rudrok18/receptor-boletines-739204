import { Router } from 'express';
import multer from 'multer';
import { createBoletin } from '../controllers/postboletin.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), createBoletin);

export default router;