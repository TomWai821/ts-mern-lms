
import { FC, useContext } from "react";
import { Box,  Typography } from "@mui/material";

// Template
import ModalTemplate from "../../../Templates/ModalTemplate";

// UI Fragnemt
import ModalConfirmButton from "../../../UIFragment/ModalConfirmButton";

// Context
import { useModal } from "../../../../Context/ModalContext";
import { useUserContext } from "../../../../Context/User/UserContext";

// Model
import { DeleteModalInterface } from "../../../../Model/ModelForModal";

// Data (CSS Syntax)
import { ModalBodySyntax, ModalSubTitleSyntax } from "../../../../Data/Style";
import { GetResultInterface, UserResultDataInterface } from "../../../../Model/ResultModel";
import { AlertContext } from "../../../../Context/AlertContext";

const UnsuspendUserActivityModal:FC<DeleteModalInterface> = ({...userData}) => 
{

    const { _id, data } = userData;
    const Data = data as UserResultDataInterface;
    
    const { changeUserStatus } = useUserContext();
    const { handleClose } = useModal();
    const alertContext = useContext(AlertContext);

    const UnsuspendUserAction = async () => 
    {
        const response: Response  = await changeUserStatus("UnSuspend", _id, "Normal", Data.suspendedDetails?._id as string);

        const result: GetResultInterface = await response.json();
                
        if (alertContext && alertContext.setAlertConfig) 
        {
            if(!response.ok)
            {
                alertContext.setAlertConfig({ AlertType: "error", Message: result.error as string });
                return;
            }
            alertContext.setAlertConfig({ AlertType: "success", Message: result.message as string });
            setTimeout(() => { handleClose() }, 2000);
        }
    }
 
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
            
            <ModalConfirmButton clickEvent={UnsuspendUserAction} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default UnsuspendUserActivityModal;