import User from "../models/user.model.js";


export const createUser = async ({
    email,password
}) => {
    if(!email || !password) {
        throw new Error("Email and password are required");
    }
    const hashedPassword = await User.hashPassword(password);
    const user = new User({
        email,
        password: hashedPassword
    });
    await user.save();
    return user;
}

export const getAllUsers = async ({ userId }) => {
    const users = await User.find({
        _id: { $ne: userId }
    });
    return users;
}
