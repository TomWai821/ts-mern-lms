import { CreateUser } from "../../schema/user/user";
import { bcryptHash } from "../../controller/hashing";
import { CreateUserInterface } from "../../model/requestInterface";

export const RegisterService = async (registerData: Omit<CreateUserInterface, "avatarUrl">) => 
{
    const initials = (registerData.username.split(' ').map((word) => word[0].toUpperCase())).slice(0, 2).join("");
    const avatarUrl = `https://via.placeholder.com/150?text=${initials}`

    // Hash password with bcrypt after validate email and username
    const hashedPassword = await bcryptHash(registerData.password); 
    const mongoDate = new Date(registerData.birthDay);

    // Create a new user after hashing the password
    const newUser = await CreateUser(
    { 
        email: registerData.email, 
        username: registerData.username, 
        password: hashedPassword, 
        gender: registerData.gender, 
        role: registerData.role, 
        status: registerData.status, 
        birthDay: mongoDate,
        avatarUrl
    });

    if(!newUser)
    {
        return {message: "Failed to create User"};
    }

    
    const data = { user: { _id: newUser?._id } }; 
    return {newUser, data};
}