
import { FC } from "react";
import { Box,  Typography } from "@mui/material";

// Template
import ModalTemplate from "../../../../../component/Templates/ModalTemplate";

// UI Fragnemt
import ModalConfirmButton from "../../../../../component/UIFragment/ModalConfirmButton";

// Model
import { DeleteModalInterface } from "../../../../../Model/ModelForModal";

// Data (CSS Syntax)
import { ModalBodySyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";
import { UserResultDataInterface } from "../../../../../Model/ResultModel";
import { useSuspendUserAction } from "../../../../../hooks/actionhook/useSuspendUserAction";

const UnsuspendUserActivityModal:FC<DeleteModalInterface> = ({...userData}) => 
{
    const { _id, data } = userData;
    const Data = data as UserResultDataInterface;
    
    const { UnSuspendUser } = useSuspendUserAction();
 
    return(
        <ModalTemplate title={"Unsuspend User Confirmation"} width="400px" cancelButtonName={"No"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>{"Do you want to unsuspend this account?"}</Typography>
                <Typography>Username: {Data.username}</Typography>
                <Typography>Email: {Data.email}</Typography>
                <Typography>Role: {Data.role}</Typography>
                <Typography>Gender: {Data.gender}</Typography>
                <Typography>Description: {Data.suspendedDetails?.description}</Typography>
            </Box>
            
            <ModalConfirmButton clickEvent={() => UnSuspendUser(_id, Data.suspendedDetails?._id as string)} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default UnsuspendUserActivityModal;