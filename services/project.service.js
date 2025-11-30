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
