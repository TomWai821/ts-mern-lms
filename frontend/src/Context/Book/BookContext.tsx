import { createContext, FC, useContext } from "react";

import { ChildProps } from "../../Model/ContextAndProviderModel";

import { useWebSocket } from "../../hooks/customhook/WebSocket";
import { BookRecordwsEventToActionMap } from "../../services/ws/config/WSConfig";
import { fetchAllBooks, fetchAllLoanBook } from "../../services/contents/bookService";
import { BookDataInterface, LoanBookInterface } from "../../Model/ResultModel";
import { useBookReduer } from "../../Reducer/BookRecordReducer";
import { BookAction } from "../../Reducer/Book/BookReducer";
import { LoanBookAction } from "../../Reducer/Book/LoanBookReducer";

export interface BookContextProps
{
    bookData:(BookDataInterface[] | LoanBookInterface[])[];
    initBooks: (isAdmin: boolean) => Promise<void>;
    refreshBooks: (type:string, isAdmin: boolean) => Promise<void>;
    modifyBooks: (action: BookAction | LoanBookAction) => void;
}

const BookContext = createContext<BookContextProps | undefined>(undefined);

export const BookProvider:FC<ChildProps> = ({children}) => 
{
    const {state, dispatch} = useBookReduer();
    const bookData = [state.AllBook, state.OnLoanBook];
    
    useWebSocket(dispatch, BookRecordwsEventToActionMap);

    const initBooks = async (isAdmin: boolean) =>
    {
        const [ books, loanBooks ] = await Promise.allSettled([fetchAllBooks(), fetchAllLoanBook(isAdmin)]);

        const booksResult: BookDataInterface[] | undefined = books.status === 'fulfilled' ? books.value : undefined;
        const loanBooksResult: LoanBookInterface[] | undefined = loanBooks.status === 'fulfilled' ? loanBooks.value : undefined;
        console.log(books);
    
        if (booksResult && Array.isArray(booksResult)) 
        {
            modifyBooks({ type: "SET_ALL_BOOK", payload: booksResult});
        }

        if (loanBooksResult && Array.isArray(loanBooksResult)) 
        {
            modifyBooks({ type: "SET_LOAN_BOOK", payload: loanBooksResult });
        }
    };

    const refreshBooks = async (type:string, isAdmin: boolean) =>
    {
        switch(type)
        {
            case "AllBook":
                const booksResult: BookDataInterface[] | undefined = await fetchAllBooks();
                modifyBooks({ type: "SET_ALL_BOOK", payload: booksResult as BookDataInterface[]});
                break;

            case "LoanBook":
                const loanBooksResult: LoanBookInterface[] | undefined = await fetchAllLoanBook(isAdmin);
                modifyBooks({ type: "SET_LOAN_BOOK", payload: loanBooksResult as LoanBookInterface[] });
                break;
        }
    };

    const modifyBooks = (action: BookAction | LoanBookAction) => 
    {
        dispatch(action);
    }

    return (
        <BookContext.Provider value={{ bookData, initBooks, refreshBooks, modifyBooks }}>
            {children}
        </BookContext.Provider>
    );
}
    
export const useBookContext = () => 
{
    const context = useContext(BookContext);
    
    if (context === undefined) 
    {
        throw new Error("useBookContext must be used within a BookProvider");
    }
    return context;
};
