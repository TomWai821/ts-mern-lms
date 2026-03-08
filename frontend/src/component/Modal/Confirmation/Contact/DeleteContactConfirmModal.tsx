import { FC, useContext } from "react"
import ModalTemplate from "../../../Templates/ModalTemplate"
import { useModal } from "../../../../Context/ModalContext";
import { DeleteModalInterface } from "../../../../Model/ModelForModal";
import { Box, Typography } from "@mui/material";
import DeleteTypography from "../../../UIFragment/DeleteTypography";
import ModalConfirmButton from "../../../UIFragment/ModalConfirmButton";
import { ModalBodySyntax, ModalSubTitleSyntax } from "../../../../Data/Style";
import { useContactContext } from "../../../../Context/Book/ContactContext";
import { AlertContext } from "../../../../Context/AlertContext";

const DeleteContactConfirmModal:FC<DeleteModalInterface> = (deleteData) => 
{
    
    const {value, data} = deleteData;
    const {deleteContactData} = useContactContext();
    const {handleClose} = useModal();
    const alertContext = useContext(AlertContext);

    const type = value === 0 ? "Author" : "Publisher";
    
    const setTitle = () => 
    {
        let setTitle = {title:"", subTitle:""};

        setTitle.title = `Delete ${type} Contact Data`;
        setTitle.subTitle = "Do you want to delete this defination?"
        return setTitle;
    }

    const DeleteDefinitionAction = async () => 
    {
        const response: Response = await deleteContactData(type as string, data._id);

        if (alertContext && alertContext.setAlertConfig) 
        {
            switch(response.status)
            {
                case 200:
                    alertContext.setAlertConfig({ AlertType: "success", Message: `Delete ${type} record successfully!` });
                    setTimeout(() => { handleClose() }, 2000);
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: `Failed to delete ${type} record! Please try again later` });
                    break;
            }
        }
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
            <ModalConfirmButton clickEvent={DeleteDefinitionAction} name={"Yes"} buttonType={"Important"}/>
        </ModalTemplate>
    )
}

export default DeleteContactConfirmModal