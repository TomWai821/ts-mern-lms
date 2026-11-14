import { useUserContext } from "../../Context/User/UserContext";
import { useAuthContext } from "../../Context/User/AuthContext";
import { DetailsInterfaceForSuspend, GetResultInterface, UserResultDataInterface } from "../../Model/ResultModel";
import { changeUserStatus, editSuspendUser } from "../../services/contents/userService";
import { useMutation } from "../customhook/useMutation";

export const useSuspendUserAction = () => 
{
    const { refreshUsers } = useUserContext();
    const { isAdmin, isLoggedIn, isAuthLoading } = useAuthContext();
    const { MutationFeedback, executeMutationAndSync } = useMutation();

    const syncTasks = 
    [
        () => refreshUsers("AllUser", isAdmin, isLoggedIn, isAuthLoading), 
        () => refreshUsers("SuspendUser", isAdmin, isLoggedIn, isAuthLoading)
    ]

    const SuspendUser = async (_id: string, duration: number, description: string) => 
    {
        const response = await changeUserStatus("Suspend", _id, "Suspend", undefined, duration, description);

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);

        await executeMutationAndSync(response, syncTasks);
    }

    const EditSuspendUser = async (userId: string, _id: DetailsInterfaceForSuspend["_id"], dueDate: Date, description: DetailsInterfaceForSuspend["description"]) => 
    {
        const response = await editSuspendUser(userId, _id, dueDate, description);

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);

        await executeMutationAndSync(response, [syncTasks[1]]);
    }

    const UnSuspendUser = async (_id: string, suspendListID: string) => 
    {
        const response = await changeUserStatus("UnSuspend", _id, "Normal", suspendListID);

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);

        await executeMutationAndSync(response, syncTasks);
    }

    return {SuspendUser, EditSuspendUser, UnSuspendUser};
}
