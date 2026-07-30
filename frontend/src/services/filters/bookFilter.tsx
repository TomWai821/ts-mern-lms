import { useState, ChangeEvent, useCallback } from "react";
import { useBookContext } from "../../Context/Book/BookContext";
import { useContactContext } from "../../Context/Book/ContactContext";
import { useDefinitionContext } from "../../Context/Book/DefinitionContext";
import { BookSearchInterface } from "../../Model/BookTableModel";

const defaultValue = { bookname: "", username: "", language: "All", status:"All", genre: "All", author: "All", publisher: "All", finesPaid: "All" };

export const useBookFilter = (tabValue:number) => 
{
    const { fetchBookWithFliterData, fetchLoanBookWithFliterData } = useBookContext();
    const { definition } = useDefinitionContext();
    const { contact } = useContactContext();

    const [searchBook, setSearchBook] = useState<BookSearchInterface>(defaultValue);
    
    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { name, value } = event.target;
        setSearchBook({ ...searchBook, [name]: value });
    };

    const SearchBook = () => 
    {
        switch(tabValue)
        {
            case 0:
                const genreID = definition[0].find((genre) => genre.genre === searchBook.genre)?._id as string;;
                const languageID = definition[1].find((language) => language.language === searchBook.language)?._id as string;
                
                const authorID = contact[0].find((author) => author.author === searchBook.author)?._id as string;
                const publisherID = contact[1].find((publisher) => publisher.publisher === searchBook.publisher)?._id as string;
                fetchBookWithFliterData(searchBook.bookname, searchBook.status, genreID, languageID, authorID, publisherID);
                break;

            case 1:
                fetchLoanBookWithFliterData("AllUser", searchBook.bookname, searchBook.username, searchBook.status, searchBook.finesPaid);
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
    }, [tabValue, fetchBookWithFliterData, fetchLoanBookWithFliterData]);

    return { searchBook, setSearchBook, onChange, SearchBook, resetFilter };
}