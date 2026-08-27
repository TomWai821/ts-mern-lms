import { BookAction } from "../../../../Reducer/Book/BookReducer";

export type BookEvent = "book_create" | "book_update" | "book_delete";

export const BookWSEventToAction: Record<BookEvent, BookAction["type"]> = 
{
    book_create: "CREATE_BOOK",
    book_update: "UPDATE_BOOK",
    book_delete: "DELETE_BOOK",
};