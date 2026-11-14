import { FC, useContext } from "react";
import { Box, Typography } from "@mui/material";

// UI Fragment
import ModalConfirmButton from "../../../../../component/UIFragment/ModalConfirmButton";

// Template
import ModalTemplate from "../../../../../component/Templates/ModalTemplate";

// Model
import { SuspendModalInterface } from "../../../../../Model/ModelForModal";

// Context
import { useModal } from "../../../../../Context/ModalContext";
import { useUserContext } from "../../../../../Context/User/UserContext";

// Another Modal


// Data (CSS Syntax and dropdown data)
import { ModalBodySyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";
import { dateOption } from "../../../../../Data/TextFieldsData";
import ExpandableTypography from "../../../../../component/UIFragment/ExpandableTypography";
import { AlertContext } from "../../../../../Context/AlertContext";
import { GetResultInterface } from "../../../../../Model/ResultModel";
import SuspendUserModal from "../actions/SuspendUserModal";
import { useSuspendUserAction } from "../../../../../hooks/actionhook/useSuspendUserAction";

const SuspendUserConfirmModal:FC<SuspendModalInterface> = (banData) => 
{
    const { _id, username, durationOption, description } = banData;
    const { handleOpen } = useModal();
    const {SuspendUser} = useSuspendUserAction();

    const returnSuspendUserModal = () => 
    {
        handleOpen(<SuspendUserModal username={username} _id={_id} durationOption={durationOption} description={description}/>);
    }

    return(
        <ModalTemplate title={"Suspend User Confirmation"} width="400px" cancelButtonName={"No"}  cancelButtonEvent={returnSuspendUserModal}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>Do you want to suspend {username}?</Typography>
                <Typography>Duration: {dateOption[durationOption as number].label}</Typography>
                <ExpandableTypography title={"Description"}>{description}</ExpandableTypography>
            </Box>
            
            <ModalConfirmButton clickEvent={() => SuspendUser(_id, dateOption[durationOption as number].value, description as string)} name={"Yes"} buttonType={"Important"}/>
        </ModalTemplate>
    );
}

export default SuspendUserConfirmModal