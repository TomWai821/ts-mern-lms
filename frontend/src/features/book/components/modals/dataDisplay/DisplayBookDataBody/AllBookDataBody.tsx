"use client";
import { FC, useCallback, useEffect, useState } from "react"
import { Avatar, Box, Tab, Tabs } from "@mui/material";

import { DisplayDataModalBody } from "../../../../../../Model/ModelForModal"

import { BookImageFormat, displayAsRow} from "../../../../../../Data/Style";
import { BookDataInterface, ExternalBookDataInterface, LoanBookInterface } from "../../../../../../Model/ResultModel";
import { TransferDateToISOString } from "../../../../../../Controller/OtherController";

import { BookDataTabLabel } from "../../../../../../Data/TableData";
import CustomTabPanel from "../../../../../../component/UIFragment/CustomTabPanel";
import BookDataBody from "./ModalBody/BookDataBody";
import GoogleBookDataBody from "./ModalBody/GoogleBookDataBody";
import { TabProps } from "../../../../../../Controller/OtherUsefulController";
import { useAuthContext } from "../../../../../../Context/User/AuthContext";

import CircularProgress from '@mui/material/CircularProgress';
import { getExternalData } from "../../../../../../services/contents/bookService";

const useBookDataRenderHandler = (data: BookDataInterface | LoanBookInterface) => 
{
    const Data = data as BookDataInterface;
    const LoanData = data as LoanBookInterface;

    const BookData:Record<string, {label:string, value:any}> =
    {
        "bookname": { label: "Bookname", value: Data.bookname || LoanData.bookDetails?.bookname},
        "genre": { label: "Genre", value: Data.genreDetails?.genre || LoanData.genreDetails?.genre },
        "language": { label: "Language", value: Data.languageDetails?.language || LoanData.languageDetails?.language },
        "author": { label: "Author", value: Data.authorDetails?.author || LoanData.authorDetails?.author },
        "publisher": { label: "Publisher", value: Data.publisherDetails?.publisher || LoanData.publisherDetails?.publisher },
        "publishDate": { label: "Publish Date", value: Data.publishDate ? TransferDateToISOString(Data.publishDate as Date) : TransferDateToISOString(LoanData.bookDetails?.publishDate as string) },     
    };

    const bookname = BookData["bookname"].value;
    const author = BookData["author"].value;

    return {BookData, bookname, author};
}


const useBookImageRenderHandler = (data: BookDataInterface | LoanBookInterface) => 
{
    const Data = data as BookDataInterface;
    const LoanData = data as LoanBookInterface;

    const imageUrl = Data.image?.url || LoanData.bookDetails?.image?.url;
    const descriptionData = Data.description || LoanData.bookDetails?.description;
    const status = Data.status || LoanData.bookDetails?.status;

    return {imageUrl, descriptionData, status};
}


const useExternalDataHandler = (bookname:string, author:string) => 
{
    const { isLoggedIn } = useAuthContext();

    const [externalBookData, setExternalBookData] = useState({averageRating: "N/A", ratingsCount: "N/A", categories: "N/A", listPrice: "N/A", retailPrice: "N/A", ISBN_13_Code: "N/A", ISBN_10_Code: "N/A"});
    const RatingAsNumber = Number.parseInt(externalBookData.averageRating);

    const [loading, setLoading] = useState(true);

    const getBookDataFromExternal = useCallback(async () => 
    {
        if(isLoggedIn) 
        {
            const result = await getExternalData(bookname, author);
            setExternalBookData(result?.foundExternalBook as ExternalBookDataInterface);
            setLoading(false);
        }
    }, [isLoggedIn, getExternalData, bookname, author]);

    useEffect(() => 
    {
        getBookDataFromExternal()
    },[getBookDataFromExternal])

    return {externalBookData, loading, RatingAsNumber};
}

const AllBookDataBody:FC<DisplayDataModalBody> = (AllUserData) => 
{
    const { isLoggedIn } = useAuthContext();

    const { data } = AllUserData;

    const {BookData, bookname, author} = useBookDataRenderHandler(data as BookDataInterface | LoanBookInterface);
    const {imageUrl, descriptionData, status} = useBookImageRenderHandler(data as BookDataInterface | LoanBookInterface);
    const {externalBookData, loading, RatingAsNumber} = useExternalDataHandler(bookname, author);

    const [tabValue, setTabValue] = useState(0);
    
    const changeTabValue = (event: React.SyntheticEvent, newValue: number) =>
    {
        setTabValue(newValue);
    }

    return(
        <Box>
            {
                isLoggedIn && 
                <Tabs value={tabValue} onChange={changeTabValue} sx={{paddingBottom: '50px', width: '500px'}}>
                    {
                        BookDataTabLabel.map((tab, index) => 
                        (
                            <Tab key={index} label={tab.label} {...TabProps(index)}/>
                        ))
                    }
                </Tabs>
            }
            
            <Box sx={{...displayAsRow, justifyContent: 'space-between', width: '500px'}}>
                <Avatar src={imageUrl} alt="Preview" variant="rounded" sx={{...BookImageFormat, paddingTop: '50px'}}/>
                
                <CustomTabPanel index={tabValue} value={0}>
                    <BookDataBody BookData={BookData} status={status as string} descriptionData={descriptionData}/>
                </CustomTabPanel>
               
                <CustomTabPanel index={tabValue} value={1}>
                    {
                        loading ? 
                        <Box sx={{ display: 'grid', gap: '20px 50px', width:'350px', gridTemplateColumns: '100%', paddingLeft: '10px'}}>
                            Loading... 
                            <CircularProgress/>
                        </Box> 
                        : 
                        <GoogleBookDataBody externalBookData={externalBookData} RatingAsNumber={RatingAsNumber}/>
                    }
                </CustomTabPanel>
            </Box>
        </Box>
    );
}

export default AllBookDataBody