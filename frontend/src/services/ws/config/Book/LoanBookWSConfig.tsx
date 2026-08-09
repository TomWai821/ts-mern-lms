import { LoanBookAction } from "../../../../Reducer/Book/LoanBookReducer";

export enum LoanBookEvent 
{
    LOAN_BOOK_CREATE = "loan_book_create",
    LOAN_BOOK_UPDATE = "loan_book_update",
    LOAN_BOOK_DELETE = "loan_book_delete",
}

export const LoanBooKWSEventToAction: Record<LoanBookEvent, LoanBookAction["type"]> = 
{
    [LoanBookEvent.LOAN_BOOK_CREATE]: "CREATE_LOAN_BOOK",
    [LoanBookEvent.LOAN_BOOK_UPDATE]: "UPDATE_LOAN_BOOK",
    [LoanBookEvent.LOAN_BOOK_DELETE]: "DELETE_LOAN_BOOK",
};