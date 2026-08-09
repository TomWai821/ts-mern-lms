import { FindSuspendList, FindSuspendListByIDAndDelete } from "../../schema/user/suspendList";
import { UserInterface } from "../../model/userSchemaInterface";
import { FindUserByIDAndDelete } from "../../schema/user/user";
import { broadcast, UserEvent } from "../../ws";

export const DeleteUserService = async (foundUser: UserInterface) => 
{
    const findSuspendRecord = await FindSuspendList({userID: foundUser._id});

    if(findSuspendRecord)
    {
        const deleteSuspendRecord = await FindSuspendListByIDAndDelete(findSuspendRecord._id as unknown as string);

        if(!deleteSuspendRecord)
        {
            return {success: false, statusCode: 401, message: "Failed to delete suspend list data!"};
        }

        broadcast(UserEvent.SUSPEND_USER_DELETE, foundUser._id);
    }

    const deleteUser = await FindUserByIDAndDelete(foundUser._id as unknown as string);
    
    if(!deleteUser)
    {
        return {success: false, statusCode: 401, message: "Failed to delete user!"};
    }

    broadcast(UserEvent.USER_DELETE, foundUser._id);

    return {success: true, statusCode: 200, message: "Delete user successfully!" };
}