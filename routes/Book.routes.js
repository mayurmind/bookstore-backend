import express from 'express';
import { addBook,getAllBooks,getBookById } from '../controller/Book.controller.js';
import { upload } from '../multer/upload.middleware.js';
import { protectRoute, isAdmin } from '../Middleware/auth.middleware.js';
const router = express.Router();

router.post('/addbook',protectRoute,isAdmin, upload.single("image"), addBook)

router.get("/", getAllBooks)
export default router;