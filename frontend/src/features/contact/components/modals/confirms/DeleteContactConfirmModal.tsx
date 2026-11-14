import { FC } from "react"
import ModalTemplate from "../../../../../component/Templates/ModalTemplate"
import { DeleteModalInterface } from "../../../../../Model/ModelForModal";
import { Box, Typography } from "@mui/material";
import DeleteTypography from "../../../../../component/UIFragment/DeleteTypography";
import ModalConfirmButton from "../../../../../component/UIFragment/ModalConfirmButton";
import { ModalBodySyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";
import { useContactAction } from "../../../../../hooks/actionhook/useContactAction";

const DeleteContactConfirmModal:FC<DeleteModalInterface> = (deleteData) => 
{
    
    const { value, data } = deleteData;
    const { DeleteContact } = useContactAction();

    const type = value === 0 ? "Author" : "Publisher";
    
    const setTitle = () => 
    {
        let setTitle = {title:"", subTitle:""};

        setTitle.title = `Delete ${type} Contact Data`;
        setTitle.subTitle = "Do you want to delete this contact data?"
        return setTitle;
    }
    
    return(
        <ModalTemplate title={setTitle().title} width="400px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>{setTitle().subTitle}</Typography>

                {
                    data.author ? <Typography>Author: {data.author}</Typography> : <Typography>Publisher: {data.publisher}</Typography>
                }

                <Typography>Phone No: {data.phoneNumber}</Typography>
                <Typography>Email: {data.email}</Typography>
            </Box>
            
            <DeleteTypography/>
            <ModalConfirmButton clickEvent={() => DeleteContact(type, data)} name={"Yes"} buttonType={"Important"}/>
        </ModalTemplate>
    )
}

export default DeleteContactConfirmModal