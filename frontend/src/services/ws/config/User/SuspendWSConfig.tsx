import { SuspendUserAction } from "../../../../Reducer/User/SuspendUserReducer";

enum SuspendUserEvent 
{
    SUSPEND_USER_CREATE = "suspend_user_create",
    SUSPEND_USER_UPDATE = "suspend_user_update",
    SUSPEND_USER_DELETE = "suspend_user_delete",
}

export const SuspendUserWSEventToAction: Record<SuspendUserEvent, SuspendUserAction["type"]> = 
{
    [SuspendUserEvent.SUSPEND_USER_CREATE]: "CREATE_SUSPEND_USER",
    [SuspendUserEvent.SUSPEND_USER_UPDATE]: "UPDATE_SUSPEND_USER",
    [SuspendUserEvent.SUSPEND_USER_DELETE]: "DELETE_SUSPEND_USER",
};