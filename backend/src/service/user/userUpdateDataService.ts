import { NextFunction, Response } from "express";
import { FindUser } from "../../schema/user/user";
import { CreateSuspendList, FindSuspendList } from "../../schema/user/suspendList";
import { UserInterface } from "../../model/userSchemaInterface";
import { AuthRequest } from "../../model/requestInterface";

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

export const CreateStatusListService = async (statusForUserList: string,  userId: string, description: string, startDate: Date, dueDate: Date) => 
{
    try 
    {
        switch (statusForUserList) 
        {
            case "Suspend":
                const existingSuspend = await FindSuspendList({ userId: userId });
                
                if (existingSuspend) 
                {
                    return existingSuspend;
                }

                const newSuspendList = await CreateSuspendList({  userID: userId,  description: description, startDate: startDate, dueDate: dueDate });
                
                return newSuspendList;

            default:
                console.warn(`Invalid status provided: ${statusForUserList}`);
                return null;
        }

    } 
    catch (error) 
    {
        console.error("CreateStatusListService Error:", error);
        throw new Error("Internal Service Error: Failed to process status list.");
    }
};
