import { broadcast, UserEvent } from "../../ws";
import { FindUserByIDAndUpdate } from "../../schema/user/user";
import { SuspendUserDTO } from "./SuspendUserDTOService";
import { UserInterface } from "../../model/userSchemaInterface";
import { CreateSuspendList, FindSuspendList } from "../../schema/user/suspendList";

export const SuspendUserService = async (userId: string, description: string, startDate: Date, dueDate: Date, foundUser: UserInterface) => 
{
    const createSuspendRecord = await CreateSuspendRecordService("Suspend", userId, description, startDate, dueDate);

    if(!createSuspendRecord)
    {
        return {success: false, statusCode: 400, message: "Fail to Create Record in Suspend List"};
    }

    const changeStatusInUsertable = await FindUserByIDAndUpdate(userId, {status: "Suspend"})

    if(!changeStatusInUsertable) 
    {
        return {success: false, statusCode: 400, message: "Failed to update status in User Table"};
    }

    broadcast(UserEvent.SUSPEND_USER_CREATE, SuspendUserDTO(foundUser, createSuspendRecord));
    broadcast(UserEvent.USER_UPDATE, changeStatusInUsertable);

    return {success: true, statusCode: 200, message: "Suspend User Successfully!"};
}

// For suspend List
export const CreateSuspendRecordService = async (statusForUserList: string,  userId: string, description: string, startDate: Date, dueDate: Date) => 
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

                const newSuspendList = await CreateSuspendList({ userID: userId, description: description, startDate: startDate, dueDate: dueDate });
                
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
