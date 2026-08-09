import { FindUserByID } from "../../schema/user/user";
import { SuspendListInterface, UserInterface } from "../../model/userSchemaInterface";

export const SuspendUserDTO = (foundUser: UserInterface, createStatusData: SuspendListInterface) => 
{
    const userData = {_id: foundUser._id, username: foundUser.username, role: foundUser.role, gender: foundUser.gender, email: foundUser.email};

    return {...userData, suspendedDetails: createStatusData};
}

export const SuspendUserEditDTO = async (suspendListData: SuspendListInterface) => 
{
    const userRecord = await FindUserByID(suspendListData.userID as unknown as string) as UserInterface;

    return SuspendUserDTO(userRecord, suspendListData);
}