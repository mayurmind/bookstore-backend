import express from "express";
import { protectRoute } from "../Middleware/auth.middleware.js";
import { getBookInsights } from "../controller/Ai.controller.js";
const router = express.Router()

router.get("/:bookId", protectRoute, getBookInsights)


export default router;
