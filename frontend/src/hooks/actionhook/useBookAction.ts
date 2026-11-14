import { useBookContext } from "../../Context/Book/BookContext";
import { useAuthContext } from "../../Context/User/AuthContext";
import { BookDataInterfaceForEdit, GetResultInterface } from "../../Model/ResultModel";
import { createBook, deleteBook, editBook } from "../../services/contents/bookService";
import { useMutation } from "../customhook/useMutation";

interface BookRequestData
{
    bookname: string;
    description: string;
    publishDate: string;
    genreID: string;
    languageID: string;
    authorID: string;
    publisherID: string;
    image: File | undefined;
}

export const useBookAction = () => 
{
    const { refreshBooks } = useBookContext();
    const { isAdmin } = useAuthContext();
    const { MutationFeedback, executeMutationAndSync } = useMutation();

    const syncTasks = [() => refreshBooks("AllBook", isAdmin)];

    const CreateBook = async (RequestData: BookRequestData) => 
    {
        const response = await createBook(RequestData);
        const result: GetResultInterface = await response.json();

        await MutationFeedback(response, result);
        await executeMutationAndSync(response, syncTasks);
    }

    const EditBook = async (CompareDataID: BookDataInterfaceForEdit["_id"], updateData: any) => 
    {
        const response = await editBook(CompareDataID, updateData);
        const result: GetResultInterface = await response.json();

        await MutationFeedback(response, result);
        await executeMutationAndSync(response, syncTasks);
    }

    const DeleteBook = async (bookID: string) => 
    {
        const response = await deleteBook(bookID);
        const result: GetResultInterface = await response.json();
        
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, syncTasks);
    }

    return {CreateBook, EditBook, DeleteBook};
}
