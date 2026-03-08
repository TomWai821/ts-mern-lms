import { Request, Response } from 'express';
import { AuthRequest, CreateUserInterface } from '../model/requestInterface';
import { jwtSign, bcryptHash, comparePassword } from './hashing'
import { UserInterface } from '../model/userSchemaInterface';
import { CreateUser, FindUser, FindUserByIDAndDelete, FindUserByIDAndUpdate } from '../schema/user/user';

import { ObjectId } from 'mongoose';
import { CreateStatusList } from './middleware/User/userUpdateDataMiddleware';
import { FindSuspendListByIDAndUpdate } from '../schema/user/suspendList';

export const UserRegister = async(req: Request, res: Response) =>
{
    const { email, username, password, gender, birthDay, role, status }: CreateUserInterface = req.body;
    let success = false;

    try
    {   
        const initals = (username.split(' ').map((word) => word[0].toUpperCase())).slice(0, 2);
        const avatarUrl = `https://via.placeholder.com/150?text=${initals}`

        // Hash password with bcrypt after validate email and username
        const hashedPassword = await bcryptHash(password); 
        const mongoDate = new Date(birthDay);
    
        // Create a new user after hashing the password
        const newUser = await CreateUser({ email, username, password: hashedPassword, gender, role, status, birthDay: mongoDate, avatarUrl});

        if(!newUser)
        {
            return res.status(400).json({success, error: "Failed to create User"});
        }
        
        // Get user id after create the user and Transfer user id as authToken with jsonWebToken
        const data = { user: { _id: newUser?._id } }; 
        const authToken = await jwtSign(data); 
        success = true; 
    
        res.json({ success, message: "Register successfully!", data:{authToken, username, status: newUser.status, role: newUser.role, avatarUrl: avatarUrl} })
    }
    catch (error) 
    { 
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success, error: 'Internal Server Error!' });
    }
}

export const UserLogin = async (req: AuthRequest, res: Response) =>
{
    const user = req.user as UserInterface;
    let success = false;
    
    try 
    {
        const data = { user: { _id: user._id } };
        const username = user.username;
        const role = user.role;
        const status = user.status;
        const avatarUrl = user.avatarUrl;
    
        const authToken: string = await jwtSign(data);

        success = true;
        res.json({ success, message: "Login Successfully!" , data:{username, role, authToken, status, avatarUrl} });
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success, error: 'Internal Server Error!' });
    }
};

export const GetUserData = async (req: AuthRequest, res: Response) =>
{
    try 
    {
        const foundUser = req.foundUser;
        res.send({ success: true, foundUser });
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success: false, error: "Internal Server Error!" });
    }
};

export const GetSelfUserData = async (req: AuthRequest, res: Response) =>
{
    const userId = req.user;

    try 
    {
        const foundUser = await FindUser({_id: userId});
        res.send({ success: true, foundUser });
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success: false, error: "Internal Server Error!" });
    }
};

export const ChangeUserData = async (req: AuthRequest, res: Response) => 
{
    const foundUser = req.foundUser as UserInterface;
    const updateData = req.updateData as Record<string, any>;
    let success = false;

    try 
    {
        const modifyData = await FindUserByIDAndUpdate(foundUser._id as unknown as string, updateData); 

        if(!modifyData)
        {
            return res.json({success, message: "Fail to update Data!"})
        }

        success = true;
        res.json({ success, message: "Data updated successfully!" });
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success, error: "Internal Server Error!" });
    }
};

export const UpdateUserData = async (req:AuthRequest, res:Response) => 
{
    const {username, password} = req.body;
    const {type} = req.params;
    const userId = req.user;
    let updateData;
    let success = false;

    try
    {
        switch(type)
        {
            case "username":
                const GetUserName = await FindUser({username: username});

                if(GetUserName)
                {
                    return res.status(400).json({ success, error: "The user with this username are already exist!" });
                }

                updateData = await FindUserByIDAndUpdate(userId as unknown as string, {username: username});
                break;

            case "password":
                const GetUserData = await FindUser({_id: userId}) as UserInterface;
                const match = await comparePassword(password, GetUserData.password);
                if(match)
                {
                    return res.status(400).json({ success, error: "New password cannot be the same as the old password!" });
                }

                const hashedPassword = await bcryptHash(password);
                updateData = await FindUserByIDAndUpdate(userId as unknown as string, {password: hashedPassword})
                break;

            default:
                return res.status(400).json({ success, error: `Invalid Update type: ${type} !` });
        }

        if(!updateData)
        {
            return res.status(400).json({ success, error: `Failed to update ${type}!` });
        }
       
        success = true;
        res.json({ success, message: `${type} data update successfully!` });
    }
    catch(error)
    {
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success, error: "Internal Server Error!" });
    }
}

export const ChangeStatus = async (req:AuthRequest, res:Response) => 
{
    const { statusForUserList, description, startDate, dueDate, banListID } = req.body;
    const foundUser = req.foundUser as UserInterface;
    const userId = foundUser._id as ObjectId;
    let success = false;

    try
    {
        if(statusForUserList !== "Normal" && foundUser.status === "Normal")
        {
            const createStatusData = await CreateStatusList(statusForUserList, userId as unknown as string, description, startDate, dueDate);

            if(!createStatusData)
            {
                return res.status(400).json({success, message:"Fail to Create Record in Suspend List"});
            }
        }

        const changeStatusInUsertable = await FindUserByIDAndUpdate(userId as unknown as string, {status: statusForUserList});

        if(!changeStatusInUsertable)
        {
            return res.status(400).json({success, message:"Failed to update status in User Table"});
        }

        if(statusForUserList === "Normal")
        {
            const unSuspendDate = new Date();
            const changeSuspendListStatus = await FindSuspendListByIDAndUpdate(banListID, {status: "Unsuspend", unSuspendDate: unSuspendDate});

            if(!changeSuspendListStatus)
            {
                return res.status(400).json({success, message:"Failed to update status in Suspend List Table"});
            }
        }

        success = true;
        res.json({ success, message:"Change Status Successfully!"});
    }
    catch (error) 
    {
         console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success, error: "Internal Server Error!" });
    }
}

export const ModifySuspendListData = async (req: AuthRequest, res:Response) => 
{
    const { banListID, dueDate, description } = req.body;
    let success = false;

    try
    {
        const modifySuspendList = await FindSuspendListByIDAndUpdate(banListID as unknown as string, {dueDate, description});

        if(!modifySuspendList)
        {
            return res.status(400).json({ success, error: "Failed to update Suspend List record!"});
        }

        success = true;
        res.json({ success, message: "Suspend List Record Update Successfully!"});
    }
    catch(error)
    {
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success, error: "Internal Server Error!" });
    }
}

export const DeleteUser = async (req: AuthRequest, res: Response) => 
{
    const foundUser = req.foundUser as UserInterface;
    let success = false;

    try 
    {
        const deleteUser = await FindUserByIDAndDelete(foundUser._id as unknown as string);

        if(!deleteUser)
        {
            return res.status(401).json({ success, error: "Failed to delete user!" });
        }

        success = true;
        res.json({ success, message: "Delete user successfully!" });
    }
    catch(error)
    {
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success, error: "Internal Server Error!" });
    }
}