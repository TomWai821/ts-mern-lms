import { broadcast, UserEvent } from "../../ws";
import { FindSuspendListByIDAndUpdate } from "../../schema/user/suspendList";
import { SuspendUserDTO } from "./SuspendUserDTOService";
import { FindUserByIDAndUpdate } from "../../schema/user/user";

export const UnsuspendUserService = async (suspendListID: string) =>
{
    const unSuspendDate = new Date();
    const changeSuspendListStatus = await FindSuspendListByIDAndUpdate(suspendListID, {status: "Unsuspend", unSuspendDate: unSuspendDate});
    
    if(!changeSuspendListStatus)
    {
        return {success: false, statusCode: 400, message: "Failed to update status in Suspend List Table"};
    }

    const changeStatusInUsertable = await FindUserByIDAndUpdate(changeSuspendListStatus.userID as unknown as string, {status: "Normal"});
    
    if(!changeStatusInUsertable) 
    {
        return  {success: false, statusCode: 400, message: "Failed to update status in User Table"}
    }
    
    broadcast(UserEvent.SUSPEND_USER_UPDATE, SuspendUserDTO(changeStatusInUsertable, changeSuspendListStatus));
    broadcast(UserEvent.USER_UPDATE, changeStatusInUsertable);

    return {success: true, statusCode: 200, message: "Unsuspend User Successfully!"};
}