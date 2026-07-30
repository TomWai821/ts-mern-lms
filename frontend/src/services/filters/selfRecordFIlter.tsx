import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useContactContext } from "../../Context/Book/ContactContext";
import { useDefinitionContext } from "../../Context/Book/DefinitionContext";
import { useSelfBookRecordContext } from "../../Context/Book/SelfBookRecordContext";

const defaultValue = {bookname: "", status: "All", author: "All", publisher: "All", genre: "All", language: "All"};

export const useSelfRecordFilter = (tabValue:number) =>
{
    const { contact } = useContactContext();
    const { definition } = useDefinitionContext();
    const { fetchSelfFavouriteBookWithFilterData, fetchSelfLoanBookWithFilterData } = useSelfBookRecordContext();

    const [searchData, setSearchData] = useState(defaultValue);

    const searchSelfRecord = () => 
    {
        switch(tabValue)
        {
            case 0:
                fetchSelfLoanBookWithFilterData("Self", searchData.bookname, searchData.status);
                break;

            case 1:
                const genreID = definition[0].find((genre) => genre.genre === searchData.genre)?._id as string;
                const languageID = definition[1].find((language) => language.language === searchData.language)?._id as string;
                
                const authorID = contact[0].find((author) => author.author === searchData.author)?._id as string;
                const publisherID = contact[1].find((publisher) => publisher.publisher === searchData.publisher)?._id as string;
                fetchSelfFavouriteBookWithFilterData(searchData.bookname, searchData.status, genreID, languageID, authorID, publisherID);
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
                fetchSelfLoanBookWithFilterData("Self", "", "");
                break;

            case 1:
                fetchSelfFavouriteBookWithFilterData("", "All", "All", "All", "All", "All");
                break;
        }

        setSearchData(defaultValue);
    }, [tabValue, fetchSelfLoanBookWithFilterData, fetchSelfFavouriteBookWithFilterData])

    useEffect(() =>
    {
        resetFilter()
    },[tabValue, resetFilter])

    return { searchData, onChange, searchSelfRecord, resetFilter };
}