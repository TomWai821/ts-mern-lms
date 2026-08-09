import { AuthorAction } from "../../../../Reducer/Contact/AuthorReducer";

export type AuthorEvent = "author_create" | "author_update" | "author_delete";

export const AuthorWSEventToAction: Record<AuthorEvent, AuthorAction["type"]> = 
{
    author_create: "CREATE_AUTHOR",
    author_update: "UPDATE_AUTHOR",
    author_delete: "DELETE_AUTHOR"
};