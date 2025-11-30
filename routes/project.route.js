import { Router } from "express";
import * as projectController from "../controllers/project.controller.js";
import { body } from "express-validator";
import { authUser } from "../middleware/auth.middleware.js";


const router = Router();

router.post('/create', authUser, body('name').isString().notEmpty().withMessage('Project name is required'),
projectController.createProject);

export default router;