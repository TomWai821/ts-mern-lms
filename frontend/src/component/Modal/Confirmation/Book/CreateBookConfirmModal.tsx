import { FC, useContext } from "react"
import { Avatar, Box, Button, Typography } from "@mui/material"

// Template
import ModalTemplate from "../../../Templates/ModalTemplate"

// Context
import { useModal } from "../../../../Context/ModalContext"

// Another Modal
import CreateBookModal from "../../Book/CreateBookModal"
import { CreateModalInterface } from "../../../../Model/ModelForModal"

// Data(CSS Syntax)
import { useBookContext } from "../../../../Context/Book/BookContext"
import { BookImageFormat, displayAsColumn, displayAsRow, ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../Data/Style"
import { useDefinitionContext } from "../../../../Context/Book/DefinitionContext"
import { useContactContext } from "../../../../Context/Book/ContactContext"
import ExpandableTypography from "../../../UIFragment/ExpandableTypography"
import { AlertContext } from "../../../../Context/AlertContext"

const CreateBookConfirmModal:FC<CreateModalInterface> = ({...bookData}) => 
{
    const { handleOpen, handleClose } = useModal();
    const { createBook } = useBookContext();
    const { definition } = useDefinitionContext();
    const { contact } = useContactContext();
    const alertContext = useContext(AlertContext);

    const { image, imageURL, bookname, genre, language, author, publisher, description, publishDate} = bookData.data;

    const languageID = definition.Language.find((languageData) => languageData.language === language)?._id as string;
    const genreID = definition.Genre.find((genreData) => genreData.genre === genre)?._id as string;
    const authorID = contact.Author.find((authorData) => authorData.author === author)?._id as string;
    const publisherID = contact.Publisher.find((publisherData) => publisherData.publisher === publisher)?._id as string;
    
    const width = image ? '600px': '400px';

    // Data for rendering
    const fieldData = 
    [   
        {label:"BookName", data: bookname},
        {label:"Language", data: language},
        {label:"Genre", data: genre},
        {label:"Publisher", data: publisher},
        {label:"Author", data: author},
        {label:"Publish Date", data: publishDate},
    ]
    
    const backToCreateModal = () => 
    {
        handleOpen( <CreateBookModal image={image} imageURL={imageURL} bookname={bookname} language={language} genre={genre} author={author} 
                publisher={publisher} description={description} publishDate={publishDate}/> );
    }

    const CreateBook = async () => 
    {
        const response: Response = await createBook(image, bookname, genreID, languageID, publisherID, authorID, description, publishDate);

        if (alertContext && alertContext.setAlertConfig) 
        {
            switch(response.status)
            {
                case 200:
                    alertContext.setAlertConfig({ AlertType: "success", Message: "Create Book record successfully!" });
                    setTimeout(() => { handleClose() }, 2000);
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: "Failed to Create book record! Please try again later" });
                    break;
            }
        }
    }

    return(
        <ModalTemplate title={"Create Book Confirmation"} width={width} cancelButtonName={"No"} cancelButtonEvent={() => backToCreateModal()}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>Do you want to create this book record?</Typography>
                <Box sx={displayAsRow}>
                    {imageURL &&
                        (
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                <Avatar src={imageURL} alt="Preview" variant="rounded" sx={BookImageFormat}/>
                            </Box>
                        )
                    } 

                    <Box sx={{...displayAsColumn, margin: '10px 0 0 20px', gap:"20px 50px"}}>
                        {!imageURL && <Typography>Image: N/A</Typography>}
                        {
                            fieldData.map((field, index) => 
                                (
                                    <Typography key={index}>{field.label}: {field.data}</Typography>
                                )
                            )
                        }
                        <ExpandableTypography title={"Description"}>{description}</ExpandableTypography>
                    </Box>
                </Box>
                <Typography sx={ModalRemarkSyntax}>Please ensure this information is correct</Typography>
            </Box>

            <Button variant="contained" onClick={CreateBook}>Yes</Button>
        </ModalTemplate>
    )
}

export default CreateBookConfirmModal