import { UserAction } from "../../../../Reducer/User/UserReducer";

enum UserEvent 
{
    USER_CREATE = "user_create",
    USER_UPDATE = "user_update",
    USER_DELETE = "user_delete",
}

export const UserWSEventToAction: Record<UserEvent, UserAction["type"]> = 
{
    [UserEvent.USER_CREATE]: "CREATE_USER",
    [UserEvent.USER_UPDATE]: "UPDATE_USER",
    [UserEvent.USER_DELETE]: "DELETE_USER",
};