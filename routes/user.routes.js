import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";

const router = Router();


router.post('/register',
     body('email').isEmail(),
     body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
     userController.createUserController); 

     router.post('/login',
     body('email').isEmail(),
     body('password').notEmpty().withMessage('Password is required'),
     userController.loginUserController);


export default router;