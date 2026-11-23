import { FC, JSX, useContext, useMemo } from "react"
import { Avatar, Box, Button, Typography } from "@mui/material";

// Template
import ModalTemplate from "../../../../../component/Templates/ModalTemplate";

// Context
import { useModal } from "../../../../../Context/ModalContext";

// Model
import { EditModalInterface } from "../../../../../Model/ModelForModal";

// Another Modal
import EditBookModal from "../actions/EditBookModal";

// Data (CSS Syntax)
import { BookDataInterfaceForEdit } from "../../../../../Model/ResultModel";
import { BookImageFormatForEdit, displayAsRow, ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

// other context
import { useContactContext } from "../../../../../Context/Book/ContactContext";
import { useDefinitionContext } from "../../../../../Context/Book/DefinitionContext";
import ExpandableTypography from "../../../../../component/UIFragment/ExpandableTypography";
import { useBookAction } from "../../../../../hooks/actionhook/useBookAction";


const useDataComparingHandler = (CompareData: BookDataInterfaceForEdit, EditData: BookDataInterfaceForEdit) => 
{
    const sameImage = (EditData.imageUrl === CompareData.imageUrl);

    const differences = useMemo(() =>
    {
        let differences: JSX.Element[] = [];
        const ignoreList = ["imageUrl", "filename", "description"]
    
        for (const key in CompareData)
        {
            if(ignoreList.includes(key))
            {
                continue;
            }

            if (EditData[key as keyof BookDataInterfaceForEdit] !== CompareData[key as keyof BookDataInterfaceForEdit])
            {
                differences.push(
                    <Typography key={key}>
                        {`- ${key}: ${CompareData[key as keyof BookDataInterfaceForEdit]} -> ${EditData[key as keyof BookDataInterfaceForEdit]}`}
                    </Typography>
                );
            }
        }

        if(CompareData.description.trim() !== EditData.description.trim())
        {
            differences.push(<ExpandableTypography key="description" title={"Description"}>{`${CompareData.description} -> ${EditData.description}`}</ExpandableTypography>);
        }

        if (differences.length === 0 && sameImage && CompareData.description.trim() === EditData.description.trim()) 
        {
            differences.push(<Typography key={"noChange"}>- No Change detected</Typography>);
        }
    
        return differences;
    }, [CompareData, EditData, sameImage]);

    return {sameImage, differences};
}

const useEditDataHandler = (CompareData: BookDataInterfaceForEdit, EditData: BookDataInterfaceForEdit) => 
{
    const {contact} = useContactContext();
    const {definition} = useDefinitionContext();

    const genreID = definition[0].find((genreData) => genreData.genre === EditData.genre)?._id as string;
    const languageID = definition[1].find((languageData) => languageData.language === EditData.language)?._id as string;
    const authorID = contact[0].find((authorData) => authorData.author === EditData.author)?._id as string;
    const publisherID = contact[1].find((publisherData) => publisherData.publisher === EditData.publisher)?._id as string;

    const updateData = 
    {
        imageName: CompareData.filename, newFile: EditData.image as File, 
        bookname: EditData.bookname, genreID, authorID, languageID, publisherID, 
        publishDate: EditData.publishDate as string, description: EditData.description
    };

    return {updateData};
}

const EditBookConfirmModal:FC<EditModalInterface> = (editModalData) => 
{  
    const {handleOpen} = useModal();

    const {value, editData, compareData} = editModalData;

    const CompareData = compareData as BookDataInterfaceForEdit;
    const EditData = editData as BookDataInterfaceForEdit;

    const {sameImage, differences} = useDataComparingHandler(CompareData, EditData);
    const { updateData } = useEditDataHandler(CompareData, EditData);
    const { EditBook } = useBookAction();
       
    const returnEditBookModal = () => 
    {
        handleOpen(<EditBookModal value={value} editData={EditData} compareData={CompareData} />);
    }
    
    return(
        <ModalTemplate title={"Edit Book Record Confirmation"} cancelButtonName={"No"} width={sameImage ? "400px" : "700px"} cancelButtonEvent={returnEditBookModal}>
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
            <Button variant='contained' onClick={() => EditBook(CompareData._id, updateData)}>Yes</Button>
        </ModalTemplate>

    );
}
export default EditBookConfirmModal