import { GetCurrentDate, CalculateDueDate } from "../../Controller/OtherController";
import { DeleteUserController } from "../../Controller/UserController/UserDeleteController";
import { FetchUserData } from "../../Controller/UserController/UserGetController";
import { RegisterController } from "../../Controller/UserController/UserPostController";
import { ModifyUserDataController, ModifySuspendListDataController, ModifyStatusController } from "../../Controller/UserController/UserPutController";
import { GetResultInterface } from "../../Model/ResultModel";

export async function createUser(username:string, email:string, password:string, role:string, gender:string, birthDay:string)
{
    return RegisterController(username, email, password, role, gender, birthDay)
}


export async function editUser(userId: string, username:string, email:string, gender:string, role:string)
{
    return ModifyUserDataController(userId, username, email, gender, role);
}
    

export async function editSuspendUser(userId:string, suspendedListID:string, dueDate:Date, description:string)
{
    return ModifySuspendListDataController(userId, suspendedListID, dueDate, description);
}


export async function deleteUser(userId:string)
{
    return await DeleteUserController(userId)
}


export async function fetchUsers(isAdmin: boolean)
{
    if(!isAdmin)
    {
        return [];
    }

    const result:GetResultInterface | undefined = await FetchUserData("AllUser");

    if(result && Array.isArray(result.foundUser))
    {
        return result.foundUser;
    }

    return [];
}

export async function fetchSuspendUser(isLoggedin: boolean)
{
    if(!isLoggedin)
    {
        return [];
    }

    const result: GetResultInterface | undefined = await FetchUserData("SuspendUser");
    
    if(result && Array.isArray(result.foundUser))
    {
        return result.foundUser;
    }
    return [];
}

interface FindUserInterface
{
    username?: string;
    role?: string;
    status?: string; 
    gender?: string;
}

export async function fetchUsersWithFilter(UserData: {username?: string, role?: string, status?: string, gender?: string} | undefined)
{
    const {username, role, status, gender} = UserData as FindUserInterface;

    const result : GetResultInterface | undefined = await FetchUserData("AllUser", username, role, status, gender);

    if(result && Array.isArray(result.foundUser))
    {
        return result.foundUser;        
    }
}

export async function fetchSuspendUserWithFilter(UserData: {username?: string, role?: string, status?: string, gender?: string} | undefined)
{
    const {username, role, status, gender} = UserData as FindUserInterface;

    const result : GetResultInterface | undefined = await FetchUserData("SuspendUser", username, role, status, gender);

    if(result && Array.isArray(result.foundUser))
    {
        return result.foundUser;
    }
}

export async function changeUserStatus(type: string, userId:string, status:string, ListID?:string, duration?:number, description?:string)
{
    const startDate = GetCurrentDate("Date") as Date;
    const dueDate = CalculateDueDate(duration as number);
    
    if(type === "UnSuspend")
    {
        return ModifyStatusController(type, userId, status, ListID);
    }
    
    return ModifyStatusController(type, userId, status, undefined, startDate, dueDate, description);
}