import projectModel from "../models/project.model.js";
import * as projectService from "../services/project.service.js";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";

export const createProject = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
    const {name, users} = req.body;
    const logggedInUser=await User.findById(req.user._id);
    
    res.status(201).json(await projectService.createProject({
        name,
        users: users ? [...users, logggedInUser._id] : [logggedInUser._id]
    }));
    }catch(error){
        res.status(500).json({ error: error.message });
    }   
}