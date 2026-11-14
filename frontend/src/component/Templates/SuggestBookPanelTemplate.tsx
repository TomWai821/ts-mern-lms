import { Avatar, Box, Typography } from "@mui/material"
import { FC, Fragment } from "react"
import { BookDataInterface, GetResultInterface, LoanBookInterface } from "../../Model/ResultModel"
import { TransferDateToISOString } from "../../Controller/OtherController";
import { useModal } from "../../Context/ModalContext";
import DisplayBookDataModal from "../../features/book/components/modals/dataDisplay/DisplayBookDataModal";

interface PropsInterface
{
    value: number;
    title: string;
    recommendationData: LoanBookInterface[] | GetResultInterface[] | [];
}

const useSuggestBookPanelStyles = () => 
{
    const PublishPanelSyntax = 
    {
        padding: '20px', display: 'grid', justifyContent: 'center', 
        alignItems: 'center', gap: '15px 30px', gridTemplateColumns: 'repeat(8, 10%)', 
        backgroundColor: 'lightgray', borderRadius: '10px'
    }

    const ImageSyntax = { width: "175px", height: "250px" }

    const PanelHoverSyntax = { backgroundColor: 'white', opacity: '60%', cursor: 'pointer', borderRadius: '10px'}

    const PanelSyntax = {display: 'grid', textAlign: 'center', justifyContent: 'center', width: "200px", height: "320px", padding: '10px 0'}

    return {PublishPanelSyntax, ImageSyntax, PanelHoverSyntax, PanelSyntax};
}

const SuggestBookPanelTemplate:FC<PropsInterface> = (suggestBookPanelData) => 
{
    const { value, title, recommendationData } = suggestBookPanelData;
    const { handleOpen } = useModal();

    const {PublishPanelSyntax, ImageSyntax, PanelHoverSyntax, PanelSyntax} = useSuggestBookPanelStyles();

    const isBookDataInterface = (book:any): book is BookDataInterface => 
    {
        return 'image' in book && 'bookname' in book 
    }

    const openDisplayBookDataModal = (data: BookDataInterface | LoanBookInterface) => 
    {
        handleOpen(<DisplayBookDataModal value={0} data={data}/>);
    }
    
    return(
        recommendationData && recommendationData.length > 0 ?
        <Box sx={{padding: '20px 0'}}>
            <Typography sx={{fontSize: '24px', paddingBottom: '10px'}}>{title}</Typography>
            <Box sx={PublishPanelSyntax}>
                {
                    recommendationData.map((book, index) => 
                    (
                        <Box key={index} sx={{ ...PanelSyntax, "&:hover": PanelHoverSyntax }} onClick={() => openDisplayBookDataModal(book as BookDataInterface | LoanBookInterface)}>
                            {
                                isBookDataInterface(book) ? 
                                (
                                    <Fragment>
                                        <Avatar src={book.image?.url} alt="Preview" variant="rounded"sx={ImageSyntax} />
                                        <Typography sx={{width: "175px"}}>{book.bookname}</Typography>
                                        {value === 1 ?
                                            <Typography>{`(${TransferDateToISOString(book.publishDate as Date)})`}</Typography>
                                            :
                                            <Typography>{`(${book.genreDetails.genre})`}</Typography>
                                        }
                                    </Fragment>
                                ) 
                                : 
                                (
                                    <Fragment>
                                        <Avatar src={(book as LoanBookInterface).bookDetails?.image?.url} alt="Preview" variant="rounded" sx={ImageSyntax}/>
                                        <Typography sx={{width: "175px"}}>{(book as LoanBookInterface).bookDetails?.bookname}</Typography>
                                        <Typography>{`(${(book as LoanBookInterface).count} Loans)`}</Typography>
                                    </Fragment>
                                )
                            }
                        </Box>
                    ))
                }
            </Box>
        </Box>:<></>
    )
}

export default SuggestBookPanelTemplate