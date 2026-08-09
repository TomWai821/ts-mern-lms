import { BookAction } from "../../../../Reducer/Book/BookReducer";

export enum BookEvent 
{
    BOOK_CREATE = "book_create",
    BOOK_UPDATE = "book_update",
    BOOK_DELETE = "book_delete",
}

export const BookWSEventToAction: Record<BookEvent, BookAction["type"]> = 
{
    [BookEvent.BOOK_CREATE]: "CREATE_BOOK",
    [BookEvent.BOOK_UPDATE]: "UPDATE_BOOK",
    [BookEvent.BOOK_DELETE]: "DELETE_BOOK",
};