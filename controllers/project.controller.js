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

export const getAllProjects = async (req, res) => {
    try{
        const logggedInUser=await User.findOne({ email: req.user.email });

        const allUserProjects = await projectService.getAllProjectByUserId(logggedInUser._id);

        return res.status(200).json({
            projects: allUserProjects
        });

    }catch(error){
        console.error('Error fetching projects:', error);
        res.status(400).json({ error: error.message });
    }
}

export const addUsersToProject = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const { users, projectId } = req.body;

        const logggedInUser=await User.findById(req.user._id);

        const updatedProject = await projectService.addUsersToProject(projectId, users, logggedInUser._id);

        return res.status(200).json({ project: updatedProject });
    }catch(error){
        console.log(error);
        res.status(400).json({error: error.message});
    }
}