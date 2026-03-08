import { Box, Typography } from "@mui/material";
import { useContext } from "react";

// Context
import { useUserContext } from "../../../../Context/User/UserContext";
import { AlertContext } from "../../../../Context/AlertContext";
import { useModal } from '../../../../Context/ModalContext';

// UI Fragment
import ModalConfirmButton from "../../../UIFragment/ModalConfirmButton";

// Template
import ModalTemplate from '../../../Templates/ModalTemplate';

// Another Modal
import CreateUserModal from "../../User/CreateUserModal";

// Data (CSS Synxax)
import { ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../Data/Style";



const CreateUserConfirmModal = ({...userData}) => 
{
    const {username, email, password, role, gender, birthDay} = userData;
    const birthDayToString = birthDay.toString();
 
    const { handleOpen, handleClose } = useModal();
    const { createUser } = useUserContext();
    const alertContext = useContext(AlertContext);

    const returnCreateUserModal = () => 
    {
        handleOpen(<CreateUserModal {...userData}/>);
    }

    const registerUser = async () => 
    {
        const response: Response  = await createUser("UserManagementPanel", username, email, password, role, gender, birthDay);

        if (alertContext && alertContext.setAlertConfig) 
        {
            switch(response.status)
            {
                case 200:
                   alertContext.setAlertConfig({ AlertType: "success", Message: `Create User record successfully!` });
                setTimeout(() => { handleClose() }, 2000)
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: `Failed to create User record! Please try again later` });
                    break;
            }
        }
    }

    return(
        <ModalTemplate title={"Create Account Confirmation"} width="400px" cancelButtonName={"No"} cancelButtonEvent={returnCreateUserModal}>
            <Box id="modal-description" sx={ModalBodySyntax}>
            <Typography sx={ModalSubTitleSyntax}>Do you want to create this account?</Typography>
                <Typography>Username: {username}</Typography>
                <Typography>Email: {email}</Typography>
                <Typography>Password: {password}</Typography>
                <Typography>Role: {role}</Typography>
                <Typography>Gender: {gender}</Typography>
                <Typography>BirthDay: {birthDayToString}</Typography>
                <Typography sx={ModalRemarkSyntax}>Please ensure these information are correct</Typography>
            </Box>
            
            <ModalConfirmButton clickEvent={registerUser} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default CreateUserConfirmModal;
