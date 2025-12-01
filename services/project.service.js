import projectModel from "../models/project.model.js";

export const createProject = async ({ name, users }) => {
    if (!name) {
        throw new Error("Project name is required");
    }
    if(users && !Array.isArray(users)) {
        throw new Error("Users must be an array of user IDs");
    }
    try {
        const project = await projectModel.create({
            name,
            users: users || []
        });
        return project;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error("Project name already exists");
        }
        throw error;
    }
};

export const getAllProjectByUserId = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const allUserProjects = await projectModel.find({ users: userId });
    return allUserProjects;
};

export const addUsersToProject = async (projectId, users, userId) => {
    if (!projectId) {
        throw new Error("Project ID is required");
    }
    if (!userId) {
        throw new Error("User ID is required");
    }
    if(!users || !Array.isArray(users)) {
        throw new Error("Users must be an array of user IDs");
    }
    const mongoose = await import('mongoose');
    
    if (!mongoose.default.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project ID");
    }
    
    if (!mongoose.default.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
    }
    
    for (const user of users) {
        if (!mongoose.default.Types.ObjectId.isValid(user)) {
            throw new Error("Invalid user ID in users array");
        }
    }
    
    const project = await projectModel.findById(projectId);
    
    if (!project) {
        throw new Error("Project not found");
    }
    
    if (!project.users.some(u => u.toString() === userId.toString())) {
        throw new Error("You are not authorized to add users to this project");
    }
    
    const updatedProject = await projectModel.findByIdAndUpdate(
        projectId,
        { $addToSet: { users: { $each: users } } },
        { new: true }
    );
    
    return updatedProject;
}; 