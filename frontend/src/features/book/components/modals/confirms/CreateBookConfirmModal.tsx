import { FC, useContext } from "react"
import { Avatar, Box, Button, Typography } from "@mui/material"

// Template
import ModalTemplate from "../../../../../component/Templates/ModalTemplate"

// Context
import { useModal } from "../../../../../Context/ModalContext"

// Another Modal
import CreateBookModal from "../actions/CreateBookModal"
import { CreateBookModalInterface, CreateModalInterface } from "../../../../../Model/ModelForModal"

// Data(CSS Syntax)
import { BookImageFormat, displayAsColumn, displayAsRow, ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../../Data/Style"
import { useDefinitionContext } from "../../../../../Context/Book/DefinitionContext"
import { useContactContext } from "../../../../../Context/Book/ContactContext"
import ExpandableTypography from "../../../../../component/UIFragment/ExpandableTypography"
import { useBookAction } from "../../../../../hooks/actionhook/useBookAction"


const useBookDataHandler = (book: CreateBookModalInterface["book"], imageData: CreateBookModalInterface["imageData"]) => 
{
    const { definition } = useDefinitionContext();
    const { contact } = useContactContext();

    const genreID = definition[0].find((genreData) =>  genreData.genre === book.genre )?._id as string;
    const languageID = definition[1].find((languageData) => languageData.language === book.language)?._id as string;
    const authorID = contact[0].find((authorData) => authorData.author === book.author)?._id as string;
    const publisherID = contact[1].find((publisherData) => publisherData.publisher === book.publisher)?._id as string;

    const RequestData = 
    {
        bookname: book.bookname, description: book.description, 
        publishDate: book.publishDate as string, genreID, languageID, authorID, publisherID,
        image: imageData?.image
    }

    return {RequestData};
}

const useBackToCreateModalHandler = (book: CreateBookModalInterface["book"], imageData: CreateBookModalInterface["imageData"]) => 
{
    const { handleOpen } = useModal();
    
    const backToCreateModal = () => 
    {
        handleOpen(<CreateBookModal book={book} imageData={imageData} /> );
    }

    return {backToCreateModal}
}

const CreateBookConfirmModal:FC<CreateModalInterface> = ({...bookData}) => 
{
    const { book, imageData } = bookData.data;

    const { backToCreateModal } = useBackToCreateModalHandler(book, imageData);
    const { RequestData } = useBookDataHandler(book, imageData);
    const { CreateBook } = useBookAction();

    // Data for rendering
    const fieldData = 
    [   
        {label:"BookName", data: book.bookname},
        {label:"Language", data: book.language},
        {label:"Genre", data: book.genre},
        {label:"Publisher", data: book.publisher},
        {label:"Author", data: book.author},
        {label:"Publish Date", data: book.publishDate},
    ]

    return(
        <ModalTemplate title={"Create Book Confirmation"} width={imageData.image ? "600px": "400px"} cancelButtonName={"No"} cancelButtonEvent={() => backToCreateModal()}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>Do you want to create this book record?</Typography>
                <Box sx={displayAsRow}>
                    {imageData.imageURL &&
                        (
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                <Avatar src={imageData.imageURL} alt="Preview" variant="rounded" sx={BookImageFormat}/>
                            </Box>
                        )
                    } 

                    <Box sx={{...displayAsColumn, margin: '10px 0 0 20px', gap:"20px 50px"}}>
                        {!imageData.imageURL && <Typography>Image: N/A</Typography>}
                        {
                            fieldData.map((field, index) => 
                                (
                                    <Typography key={index}>{field.label}: {field.data}</Typography>
                                )
                            )
                        }
                        <ExpandableTypography title={"Description"}>{book.description}</ExpandableTypography>
                    </Box>
                </Box>
                <Typography sx={ModalRemarkSyntax}>Please ensure this information is correct</Typography>
            </Box>

            <Button variant="contained" onClick={() => CreateBook(RequestData)}>Yes</Button>
        </ModalTemplate>
    )
}

export default CreateBookConfirmModal