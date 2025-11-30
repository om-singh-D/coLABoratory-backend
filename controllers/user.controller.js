import User from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import { validationResult } from "express-validator";



export const createUserController = async (req, res) => {

    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await createUser(req.body);

        const token = user.generateAuthToken();
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUserController = async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try{
        const { email, password } = req.body;
        const user =await User.findOne({email}).select('+password');

        if(!user){
            return res.status(400).json({ error: "Invalid email" });
        }

        const isMatch = await user.isValidPassword(password);

        if(!isMatch){
            return res.status(400).json({ error: "Invalid password" });
        }
        
        console.log('Login successful - Password:', password);
        
        const token = user.generateAuthToken();
        res.status(200).json({ user, token });
    }catch(error){
        res.status(500).json({ error: error.message });
    }   
};

export const profileController = async (req, res) => {
    console.log('Profile controller accessed - User:', req.user);
    console.log('Headers:', req.headers);
    console.log('Cookies:', req.cookies);
    
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized - No user in request" });
    }
    
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};