import { FC, JSX, useCallback, useContext, useEffect, useState } from "react"
import { Avatar, Box, Button, Typography } from "@mui/material";

// Template
import ModalTemplate from "../../../Templates/ModalTemplate";

// Context
import { useModal } from "../../../../Context/ModalContext";

// Model
import { EditModalInterface } from "../../../../Model/ModelForModal";

// Another Modal
import EditBookModal from "../../Book/EditBookModal";

// Data (CSS Syntax)
import { BookDataInterfaceForEdit } from "../../../../Model/ResultModel";
import { useBookContext } from "../../../../Context/Book/BookContext";
import { BookImageFormatForEdit, displayAsRow, ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../Data/Style";

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

// other context
import { useContactContext } from "../../../../Context/Book/ContactContext";
import { useDefinitionContext } from "../../../../Context/Book/DefinitionContext";
import ExpandableTypography from "../../../UIFragment/ExpandableTypography";
import { AlertContext } from "../../../../Context/AlertContext";

const EditBookConfirmModal:FC<EditModalInterface> = (editModalData) => 
{  
    const {handleOpen, handleClose} = useModal();
    const {editBook} = useBookContext();
    const {contact} = useContactContext();
    const {definition} = useDefinitionContext();
    const alertContext = useContext(AlertContext);

    const {value, editData, compareData} = editModalData;

    const CompareData = compareData as BookDataInterfaceForEdit;
    const EditData = editData as BookDataInterfaceForEdit;
    const sameImage = (EditData.imageUrl === CompareData.imageUrl);
    const width = sameImage ? "400px" : "700px";

    const [differences, setDifferences] = useState<JSX.Element[]>([]);

    const generateChangeTypography = useCallback((editData:BookDataInterfaceForEdit, compareData:BookDataInterfaceForEdit) => 
    {
        let differences: JSX.Element[] = [];
        const ignoreList = ["imageUrl", "filename", "description"]
    
        for (const key in compareData) 
        {
            if(ignoreList.includes(key))
            {
                continue;
            }

            if (editData[key as keyof BookDataInterfaceForEdit] !== compareData[key as keyof BookDataInterfaceForEdit]) 
            {
                differences.push(
                    <Typography key={key}>
                        {`- ${key}: ${compareData[key as keyof BookDataInterfaceForEdit]} -> ${editData[key as keyof BookDataInterfaceForEdit]}`}
                    </Typography>
                );
            }
        }

        if(CompareData.description.trim() !== EditData.description.trim())
        {
            differences.push(<ExpandableTypography title={"Description"}>{`${CompareData.description} -> ${EditData.description}`}</ExpandableTypography>);
        }

        if (differences.length === 0 && sameImage && CompareData.description.trim() === EditData.description.trim()) 
        {
            differences.push(<Typography key={"noChange"}>- No Change detected</Typography>);
        }
    
        setDifferences(differences);
    },[CompareData.description, EditData.description, sameImage])
   
    const returnEditBookModal = () => 
    {
        setDifferences([]);
        handleOpen(<EditBookModal value={value} editData={EditData} compareData={CompareData} />);
    }
    
    const editBookData = async () => 
    {
        const genreID = definition.Genre.find((genreData) => genreData.genre === EditData.genre)?._id as string;
        const langaugeID = definition.Language.find((languageData) => languageData.language === EditData.language)?._id as string;
        const publisherID = contact.Publisher.find((publisherData) => publisherData.publisher === EditData.publisher)?._id as string;
        const authorID = contact.Author.find((authorData) => authorData.author === EditData.author)?._id as string;

        const response: Response = await editBook(EditData._id, CompareData.filename, EditData.image as File, EditData.bookname, genreID, langaugeID, publisherID, EditData.publishDate as string, authorID, EditData.description);

        if (alertContext && alertContext.setAlertConfig) 
        {
            switch(response.status)
            {
                case 200:
                    alertContext.setAlertConfig({ AlertType: "success", Message: "Edit book record successfully!" });
                    setTimeout(() => { handleClose() }, 2000);
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: "Failed to Edit book record! Please try again later" });
                    break;
            }
        }
    }

    useEffect(() => 
    {
        generateChangeTypography(EditData, CompareData);
    },
    [EditData, CompareData, generateChangeTypography]);

    return(
        <ModalTemplate title={"Edit Book Record Confirmation"} cancelButtonName={"No"} width={width} cancelButtonEvent={returnEditBookModal}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>Do you want to edit this book record?</Typography>
                <Typography sx={ModalRemarkSyntax}>Changes:</Typography>
                {!sameImage &&
                    ( 
                        <Box sx={{...displayAsRow, justifyContent: 'space-between', alignItems: 'center'}}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                <Avatar src={compareData.imageUrl} alt="Preview" variant="rounded" sx={BookImageFormatForEdit}/>
                            </Box>

                            <ArrowRightAltIcon sx={{width: '125px', height: '100px'}}/>

                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                <Avatar src={EditData.imageUrl} alt="Preview" variant="rounded" sx={BookImageFormatForEdit}/>
                            </Box>
                        </Box>
                    )
                } 
                {differences}
                <Typography sx={ModalRemarkSyntax}>Please ensure this information is correct</Typography>
            </Box>
            <Button variant='contained' onClick={editBookData}>Yes</Button>
        </ModalTemplate>

    );
}
export default EditBookConfirmModal