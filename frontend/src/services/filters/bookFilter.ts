import { useState, ChangeEvent, useCallback } from "react";
import { useContactContext } from "../../Context/Book/ContactContext";
import { useDefinitionContext } from "../../Context/Book/DefinitionContext";
import { BookSearchInterface } from "../../Model/BookTableModel";
import { fetchBookWithFliterData, fetchLoanBookWithFliterData } from "../contents/bookService";
import { useBookContext } from "../../Context/Book/BookContext";
import { BookDataInterface, LoanBookInterface } from "../../Model/ResultModel";
import { useAuthContext } from "../../Context/User/AuthContext";

const bookType = ["AllBook", "LoanBook"];
const defaultValue = { bookname: "", username: "", language: "All", status:"All", genre: "All", author: "All", publisher: "All", finesPaid: "All" };

export const useBookFilter = (tabValue:number) => 
{
    const { definition } = useDefinitionContext();
    const { contact } = useContactContext();
    const { isAdmin } = useAuthContext();
    const { refreshBooks, modifyBooks } = useBookContext();

    const [searchBook, setSearchBook] = useState<BookSearchInterface>(defaultValue);
    
    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { name, value } = event.target;
        setSearchBook({ ...searchBook, [name]: value });
    };

    const SearchBook = async () => 
    {
        switch(tabValue)
        {
            case 0:
                const genreID = definition[0].find((genre) => genre.genre === searchBook.genre)?._id as string;;
                const languageID = definition[1].find((language) => language.language === searchBook.language)?._id as string;
                
                const authorID = contact[0].find((author) => author.author === searchBook.author)?._id as string;
                const publisherID = contact[1].find((publisher) => publisher.publisher === searchBook.publisher)?._id as string;
                const filteredBooks = await fetchBookWithFliterData(searchBook.bookname, searchBook.status, genreID, languageID, authorID, publisherID);
                modifyBooks({type: "SET_ALL_BOOK", payload: filteredBooks as BookDataInterface[]});
                break;

            case 1:
                const filteredLoanBooks = await fetchLoanBookWithFliterData("AllUser", searchBook.bookname, searchBook.username, searchBook.status, searchBook.finesPaid);
                modifyBooks({type: "SET_LOAN_BOOK", payload: filteredLoanBooks as LoanBookInterface[] });
                break;
        }
    }

    const resetFilter = useCallback(() => 
    {
        switch(tabValue)
        {
            case 0:
                fetchBookWithFliterData("All", "", "All", "All", "All", "All");
                break;

            case 1:
                fetchLoanBookWithFliterData("AllUser", "", "All", "All", "All");
                break;
        }
        setSearchBook(defaultValue);
        refreshBooks(bookType[tabValue], isAdmin);
    }, [tabValue, isAdmin, refreshBooks]);

    return { searchBook, setSearchBook, onChange, SearchBook, resetFilter };
}