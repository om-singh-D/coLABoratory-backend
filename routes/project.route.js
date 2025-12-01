import { Router } from "express";
import * as projectController from "../controllers/project.controller.js";
import { body } from "express-validator";
import { authUser } from "../middleware/auth.middleware.js";


const router = Router();

router.post('/create', authUser, body('name').isString().notEmpty().withMessage('Project name is required'),
projectController.createProject);


router.get('/all', authUser, projectController.getAllProjects);

router.put('/add-user', authUser, body('projectId').isString().withMessage('Project ID must be a string'), body('users').isArray().withMessage('Users must be an array').bail().custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),projectController.addUsersToProject); 

export default router;