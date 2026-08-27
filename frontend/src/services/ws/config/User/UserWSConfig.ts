import { UserAction } from "../../../../Reducer/User/UserReducer";

export type UserEvent = "user_create" | "user_update" | "user_delete";

export const UserWSEventToAction: Record<UserEvent, UserAction["type"]> = 
{
    user_create: "CREATE_USER",
    user_update: "UPDATE_USER",
    user_delete: "DELETE_USER",
};