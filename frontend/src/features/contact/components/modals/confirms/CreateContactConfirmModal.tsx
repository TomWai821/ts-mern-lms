import { FC } from "react"
import ModalTemplate from "../../../../../component/Templates/ModalTemplate"
import { CreateModalInterface } from "../../../../../Model/ModelForModal"
import { ContactInterface } from "../../../../../Model/ResultModel";
import { useModal } from "../../../../../Context/ModalContext";
import CreateContextModal from "../actions/CreateContactModal";
import ModalConfirmButton from "../../../../../component/UIFragment/ModalConfirmButton";
import { ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";
import { Box, Typography } from "@mui/material";
import { useContactAction } from "../../../../../hooks/actionhook/useContactAction";

const CreateContactConfirmModal:FC<CreateModalInterface> = (createModalData) => 
{
    const {value, data} = createModalData;

    const { handleOpen } = useModal();
    const { CreateContact } = useContactAction();

    const Data = data as ContactInterface;
    const type = value === 0 ? "Author" : "Publisher";

    const returnCreateUserModal = () => 
    {
        handleOpen(<CreateContextModal {...createModalData}/>);
    }

    return(
        <ModalTemplate title={`Create ${type} Confirmation`} width="400px" cancelButtonName={"No"} cancelButtonEvent={returnCreateUserModal}>
            <Box id="modal-description" sx={ModalBodySyntax}>
            <Typography sx={ModalSubTitleSyntax}>Do you want to create this {type}?</Typography>

                {
                    value === 0 ? <Typography>Author: {Data.author}</Typography>:<Typography>Publisher: {Data.publisher}</Typography>
                }

                <Typography>Phone No: {Data.phoneNumber !== "" ? Data.phoneNumber : "N/A"}</Typography>
                <Typography>Email: {Data.email !== "" ? Data.email : "N/A"}</Typography>

                <Typography sx={ModalRemarkSyntax}>Please ensure these information are correct</Typography>
            </Box>
            <ModalConfirmButton clickEvent={() => CreateContact(type, data)} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    )
}

export default CreateContactConfirmModal