import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: {value: true, message: "Project name must be unique"}
    },
    users: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        }
    ],
    messages: [
        {
            text: {
                type: String,
                required: true
            },
            sender: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

const Project = mongoose.model('project', projectSchema);

export default Project;