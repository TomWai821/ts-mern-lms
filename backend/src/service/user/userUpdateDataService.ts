import { NextFunction, Response } from "express";
import { FindUser, FindUserByIDAndUpdate } from "../../schema/user/user";
import { FindSuspendList } from "../../schema/user/suspendList";
import { SuspendListInterface, UserInterface } from "../../model/userSchemaInterface";
import { AuthRequest } from "../../model/requestInterface";
import { broadcast, UserEvent } from "../../ws";
import { SuspendUserDTO } from "./SuspendUserDTOService";

// For user update(Require login)
export const BuildUserUpdateDataService = async (req: AuthRequest, res:Response, next:NextFunction) => 
{
    const { username, email, gender, role } = req.body;
    const foundUser = req.foundUser as UserInterface;

    const updateData: Record<string, any> = {};
    
    let checkPromise: Promise<any>[] = [];
    let labels: string[] = [];

    if(username && username !== foundUser.username)
    {
        checkPromise.push(FindUser({username}));
        labels.push("username");
        updateData.username = username;
    }

    if(email && email !== foundUser.email)
    {
        checkPromise.push(FindUser({email}));
        labels.push("email");
        updateData.email = email;
    }

    const result = await Promise.all(checkPromise);

    for(let i = 0; i < result.length; i++)
    {
        if(result[i])
        {
            return res.status(400).json({ success: false, error: `${labels[i]} already in use` });
        }
    }

    if (gender && gender !== foundUser.gender)  
    {
        updateData.gender = gender;
    }

    if (role && role !== foundUser.role) 
    {
        updateData.role = role;
    }

    if (Object.keys(updateData).length === 0) 
    {
        return res.status(400).json({ success: false, error: "No changes detected" });
    }
    
    req.updateData = updateData;
    next();
}


export const UserDataUpdateService = async (foundUser: UserInterface, updateData: Record<string, any>) => 
{
    const modifyData = await FindUserByIDAndUpdate(foundUser._id as unknown as string, updateData); 

    if(!modifyData)
    {
        return {success: false, statusCode: 401, message: "Fail to update User Record!"}
    }

    const suspendListData = await FindSuspendList({userID: foundUser._id}) as SuspendListInterface;

    broadcast(UserEvent.USER_UPDATE, modifyData);
    broadcast(UserEvent.SUSPEND_USER_UPDATE, SuspendUserDTO(modifyData, suspendListData));
    return {success: true, statusCode: 200, message: "User Data Updated successfully!"}
}

