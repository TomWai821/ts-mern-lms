import { FC } from 'react'
import { Box, Typography } from '@mui/material'

// Models
import { DeleteModalInterface } from '../../../../../Model/ModelForModal';
import { UserResultDataInterface } from '../../../../../Model/ResultModel';

// UI Fragment
import DeleteTypography from '../../../../../component/UIFragment/DeleteTypography';

// Templates
import ModalTemplate from '../../../../../component/Templates/ModalTemplate';

// Data (CSS syntax)
import { ModalBodySyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";
import ModalConfirmButton from '../../../../../component/UIFragment/ModalConfirmButton';
import { useUserAction } from '../../../../../hooks/actionhook/useUserAction';


const DeleteUserConfirmModal:FC<DeleteModalInterface> = ({...userData}) => 
{
    const {value, _id, data} = userData;
    const Data = data as UserResultDataInterface;
    const {DeleteUser} = useUserAction();

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
            <ModalConfirmButton clickEvent={() => DeleteUser(_id)} name={"Yes"} buttonType={"Important"}/>
        </ModalTemplate>
    );
}

export default DeleteUserConfirmModal;