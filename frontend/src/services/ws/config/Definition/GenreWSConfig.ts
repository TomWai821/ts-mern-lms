import { GenreAction } from "../../../../Reducer/Definition/GenreReducer";

export type GenreEvent = "genre_create" | "genre_update" | "genre_delete";

export const GenreWSEventToAction: Record<GenreEvent, GenreAction["type"]> = 
{
    genre_create: "CREATE_GENRE",
    genre_update: "UPDATE_GENRE",
    genre_delete: "DELETE_GENRE",
};