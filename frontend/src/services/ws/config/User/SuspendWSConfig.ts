import { SuspendUserAction } from "../../../../Reducer/User/SuspendUserReducer";

export type SuspendUserEvent = "suspend_user_create" | "suspend_user_update" | "suspend_user_delete";

export const SuspendUserWSEventToAction: Record<SuspendUserEvent, SuspendUserAction["type"]> = 
{
    suspend_user_create: "CREATE_SUSPEND_USER",
    suspend_user_update: "UPDATE_SUSPEND_USER",
    suspend_user_delete: "DELETE_SUSPEND_USER",
};