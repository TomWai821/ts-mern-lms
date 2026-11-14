import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useContactContext } from "../../Context/Book/ContactContext";
import { useDefinitionContext } from "../../Context/Book/DefinitionContext";
import { fetchFavouriteBookWithFilter, fetchSelfLoanBookWithFilter } from "../contents/selfRecordService";
import { useSelfBookRecordContext } from "../../Context/Book/SelfBookRecordContext";
import { useAuthContext } from "../../Context/User/AuthContext";
import { BookDataInterface, LoanBookInterface } from "../../Model/ResultModel";


const defaultValue = {bookname: "", status: "All", author: "All", publisher: "All", genre: "All", language: "All"};

export const useSelfRecordFilter = (tabValue:number) =>
{
    const { contact } = useContactContext();
    const { definition } = useDefinitionContext();
    const { initSelfRecords, refreshSelfRecords, modifySelfRecords } = useSelfBookRecordContext();
    const { isLoggedIn, isAuthLoading } = useAuthContext();

    const [searchData, setSearchData] = useState(defaultValue);

    const searchSelfRecord = async () => 
    {
        switch(tabValue)
        {
            case 0:
                const selfLoanBook = await fetchSelfLoanBookWithFilter("Self", searchData.bookname, searchData.status);
                modifySelfRecords({type: "SET_SELF_LOAN_BOOK", payload: selfLoanBook as LoanBookInterface[]});
                break;

            case 1:
                const genreID = definition[0].find((genre) => genre.genre === searchData.genre)?._id as string;
                const languageID = definition[1].find((language) => language.language === searchData.language)?._id as string;
                
                const authorID = contact[0].find((author) => author.author === searchData.author)?._id as string;
                const publisherID = contact[1].find((publisher) => publisher.publisher === searchData.publisher)?._id as string;
                const favouriteBook = await fetchFavouriteBookWithFilter(searchData.bookname, searchData.status, genreID, languageID, authorID, publisherID);
                modifySelfRecords({type: "SET_FAVOURITE_BOOK", payload: favouriteBook as BookDataInterface[]});
                break;
        }
    }

    const onChange = (event:ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setSearchData({...searchData, [name]: value});
    }

    const resetFilter = useCallback(() => 
    {
        switch(tabValue)
        {
            case 0:
                fetchSelfLoanBookWithFilter("Self", "", "");
                refreshSelfRecords("LoanBook");
                break;

            case 1:
                fetchFavouriteBookWithFilter("", "All", "All", "All", "All", "All");
                refreshSelfRecords("FavouriteBook");
                break;
        }

        setSearchData(defaultValue);
    }, [tabValue, fetchSelfLoanBookWithFilter, fetchFavouriteBookWithFilter])

    useEffect(() =>
    {
        if(isAuthLoading) return;

        if(isLoggedIn)
        {
            initSelfRecords();
        }
    },[isAuthLoading, isLoggedIn])

    return { searchData, onChange, searchSelfRecord, resetFilter };
}