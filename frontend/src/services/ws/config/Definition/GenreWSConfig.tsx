import { GenreAction } from "../../../../Reducer/Definition/GenreReducer";

enum GenreEvent 
{
    GENRE_CREATE = "genre_create",
    GENRE_UPDATE = "genre_update",
    GENRE_DELETE = "genre_delete",
}

export const GenreWSEventToAction: Record<GenreEvent, GenreAction["type"]> = 
{
    [GenreEvent.GENRE_CREATE]: "CREATE_GENRE",
    [GenreEvent.GENRE_UPDATE]: "UPDATE_GENRE",
    [GenreEvent.GENRE_DELETE]: "DELETE_GENRE",
};