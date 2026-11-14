import { Box, Typography } from "@mui/material";

// Context
import { useModal } from '../../../../../Context/ModalContext';

// UI Fragment
import ModalConfirmButton from "../../../../../component/UIFragment/ModalConfirmButton";

// Template
import ModalTemplate from '../../../../../component/Templates/ModalTemplate';

// Another Modal
import CreateUserModal from "../actions/CreateUserModal";

// Data (CSS Synxax)
import { ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";
import { useUserAction } from "../../../../../hooks/actionhook/useUserAction";



const CreateUserConfirmModal = ({...userData}) => 
{
    const {username, email, password, role, gender, birthDay} = userData;
    const birthDayToString = birthDay.toString();
 
    const { handleOpen } = useModal();
    const { CreateUser } = useUserAction();

    const returnCreateUserModal = () => 
    {
        handleOpen(<CreateUserModal {...userData}/>);
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
            
            <ModalConfirmButton clickEvent={() => CreateUser(username, email, password, role, gender, birthDay)} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default CreateUserConfirmModal;
