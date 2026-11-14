import { useUserContext } from "../../Context/User/UserContext";
import { useAuthContext } from "../../Context/User/AuthContext";
import { GetResultInterface, UserResultDataInterface } from "../../Model/ResultModel";
import { createUser, deleteUser, editUser } from "../../services/contents/userService";
import { useMutation } from "../customhook/useMutation";

export const useUserAction = () => 
{
    const { refreshUsers } = useUserContext();
    const { isAdmin, isLoggedIn, isAuthLoading } = useAuthContext();
    const { MutationFeedback, executeMutationAndSync } = useMutation();

    const syncTasks = [() => refreshUsers("AllUser", isAdmin, isLoggedIn, isAuthLoading)];

    const CreateUser = async (username: string, email:string, password: string, role: string, gender: string, birthDay: string) => 
    {
        const response = await createUser(username, email, password, role, gender, birthDay);

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, syncTasks);
    }

    const EditUser = async (CompareDataID: UserResultDataInterface["_id"], username: string, email:string, role: string, gender: string) => 
    {
        const response = await editUser(CompareDataID, username, email, role, gender);

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, syncTasks);
    }

    const DeleteUser = async (userID: string) => 
    {
        const response = await deleteUser(userID);

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, syncTasks);
    }

    return {CreateUser, EditUser, DeleteUser};
}
