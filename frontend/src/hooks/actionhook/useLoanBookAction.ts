import { useBookContext } from "../../Context/Book/BookContext";
import { useAuthContext } from "../../Context/User/AuthContext";
import { GetResultInterface, LoanBookInterface } from "../../Model/ResultModel";
import { loanBook, returnBook } from "../../services/contents/bookService";
import { useMutation } from "../customhook/useMutation";

// type finesPaid = "Not Paid" | "Paid"

export const useLoanBookAction = () => 
{
    const { refreshBooks } = useBookContext();
    const { isAdmin } = useAuthContext();
    const { MutationFeedback, executeMutationAndSync } = useMutation();

    const syncTasks = [() => refreshBooks("LoanBook", isAdmin)];

    const SelfLoanBook = async (bookID:string) => 
    {
        const response = await loanBook(bookID);

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, syncTasks);
    }

    const LoanBookByLibrarian = async (bookID:string, LoanUserAuthToken: string) => 
    {
        const response: Response = await loanBook(bookID, LoanUserAuthToken);

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, syncTasks);
    }

    const ReturnBook = async (data: LoanBookInterface, finesPaid: string) => 
    {
        let response =  data.fineAmount as number > 0 ? await returnBook(data._id, finesPaid) : await returnBook(data._id);

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, syncTasks);
    }

    return {SelfLoanBook, LoanBookByLibrarian, ReturnBook};
}
