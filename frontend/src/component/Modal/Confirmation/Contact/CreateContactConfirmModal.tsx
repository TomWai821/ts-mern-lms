import { FC, useContext } from "react"
import ModalTemplate from "../../../Templates/ModalTemplate"
import { CreateModalInterface } from "../../../../Model/ModelForModal"
import { ContactInterface } from "../../../../Model/ResultModel";
import { useModal } from "../../../../Context/ModalContext";
import CreateContextModal from "../../Contact/CreateContactModal";
import { useContactContext } from "../../../../Context/Book/ContactContext";
import ModalConfirmButton from "../../../UIFragment/ModalConfirmButton";
import { ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../Data/Style";
import { Box, Typography } from "@mui/material";
import { AlertContext } from "../../../../Context/AlertContext";

const CreateContactConfirmModal:FC<CreateModalInterface> = (createModalData) => 
{
    const {value, data} = createModalData;

    const { handleOpen, handleClose } = useModal();
    const { createContactData } = useContactContext();
    const alertContext = useContext(AlertContext);

    const Data = data as ContactInterface;
    const type = value === 0 ? "Author" : "Publisher";

    const returnCreateUserModal = () => 
    {
        handleOpen(<CreateContextModal {...createModalData}/>);
    }

    const CreateContactData = async () => 
    {
        let response: Response;
        switch(value)
        {
            case 0:
                response = await createContactData(type, Data.author as string, Data.phoneNumber, Data.email);
                break;

            case 1:
                response = await createContactData(type, Data.publisher as string, Data.phoneNumber, Data.email);
                break;

            default:
                console.log("Invalid value");
                return;
        }

        if (alertContext && alertContext.setAlertConfig) 
        {
            switch(response.status)
            {
                case 200:
                    alertContext.setAlertConfig({ AlertType: "success", Message: `Create ${type} record successfully!` });
                    setTimeout(() => { handleClose() }, 2000);
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: `Failed to create ${type} record! Please try again later` });
                    break;
            }
        }
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
            <ModalConfirmButton clickEvent={CreateContactData} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    )
}

export default CreateContactConfirmModal