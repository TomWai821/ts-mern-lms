import { FC, useContext } from 'react'
import { Box, Typography } from '@mui/material'

// Models
import { DeleteModalInterface } from '../../../../Model/ModelForModal';
import { UserResultDataInterface } from '../../../../Model/ResultModel';

// UI Fragment
import DeleteTypography from '../../../UIFragment/DeleteTypography';

// Context
import { useModal } from '../../../../Context/ModalContext';
import { useUserContext } from '../../../../Context/User/UserContext';

// Templates
import ModalTemplate from '../../../Templates/ModalTemplate';

// Data (CSS syntax)
import { ModalBodySyntax, ModalSubTitleSyntax } from "../../../../Data/Style";
import ModalConfirmButton from '../../../UIFragment/ModalConfirmButton';
import { AlertContext } from '../../../../Context/AlertContext';


const DeleteUserConfirmModal:FC<DeleteModalInterface> = ({...userData}) => 
{
    const {value, _id, data} = userData;
    const Data = data as UserResultDataInterface;

    const { actualDeleteUser } = useUserContext();
    const { handleClose } = useModal();
    const alertContext = useContext(AlertContext);

    const DeleteUserAction = async () => 
    {
        const response: Response = await actualDeleteUser(_id);
        
        if (alertContext && alertContext.setAlertConfig) 
        {
            switch(response.status)
            {
                case 200:
                    alertContext.setAlertConfig({ AlertType: "success", Message: `Delete User record successfully!` });
                    setTimeout(() => { handleClose() }, 2000);
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: `Failed to delete User record! Please try again later` });
                    break;
            }
        }
    }

    return(
        <ModalTemplate title={"Delete User Record"} width="400px" cancelButtonName={"No"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>{"Do you want to delete this account?"}</Typography>
                <Typography>Username: {Data.username}</Typography>
                <Typography>Email: {Data.email}</Typography>
                <Typography>Role: {Data.role}</Typography>
                <Typography>Gender: {Data.gender}</Typography>
            </Box>
            
            {value === 2 && <DeleteTypography/>}
            <ModalConfirmButton clickEvent={DeleteUserAction} name={"Yes"} buttonType={"Important"}/>
        </ModalTemplate>
    );
}

export default DeleteUserConfirmModal;