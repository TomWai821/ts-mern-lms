import { AuthorAction } from "../../../../Reducer/Contact/AuthorReducer";

export enum AuthorEvent 
{
    AUTHOR_CREATE = "author_create",
    AUTHOR_UPDATE = "author_update",
    AUTHOR_DELETE = "author_delete",
}

export const AuthorWSEventToAction: Record<AuthorEvent, AuthorAction["type"]> = 
{
    [AuthorEvent.AUTHOR_CREATE]: "CREATE_AUTHOR",
    [AuthorEvent.AUTHOR_UPDATE]: "UPDATE_AUTHOR",
    [AuthorEvent.AUTHOR_DELETE]: "DELETE_AUTHOR"
};