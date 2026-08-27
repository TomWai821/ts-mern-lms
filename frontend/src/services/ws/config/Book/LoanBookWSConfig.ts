import { LoanBookAction } from "../../../../Reducer/Book/LoanBookReducer";

export type LoanBookEvent = "loan_book_create" | "loan_book_update" | "loan_book_delete";

export const LoanBookWSEventToAction: Record<LoanBookEvent, LoanBookAction["type"]> = 
{
    loan_book_create: "CREATE_LOAN_BOOK",
    loan_book_update: "UPDATE_LOAN_BOOK",
    loan_book_delete: "DELETE_LOAN_BOOK",
};