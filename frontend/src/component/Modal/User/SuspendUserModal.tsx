import { ChangeEvent, FC, useState } from "react";
import { Box, MenuItem, TextField, Typography } from "@mui/material"

// Template
import ModalTemplate from "../../Templates/ModalTemplate"

// UI Fragment
import ModalConfirmButton from "../../UIFragment/ModalConfirmButton";

// Another Modal
import SuspendUserConfirmModal from "../Confirmation/User/SuspendUserConfirmModal";

// Modals
import { useModal } from "../../../Context/ModalContext";

// Model
import { SuspendModalInterface } from "../../../Model/ModelForModal";

// Data (CSS Syntax and dropdown option)
import { ModalBodySyntax } from "../../../Data/Style";
import { dateOption } from "../../../Data/TextFieldsData";

const SuspendUserModal:FC<SuspendModalInterface> = ({...userData}) => 
{
    const { _id, username, durationOption, description} = userData as SuspendModalInterface;
    const [suspendData, setSuspendData] = useState({durationOption: durationOption ?? 0, description: description});
    const {handleOpen} = useModal();

    const onChange = (event:ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setSuspendData({...suspendData, [name] : value});
    }

    const OpenSuspendUserConfirmModal = () => 
    {
        handleOpen(<SuspendUserConfirmModal _id={_id} username={username} durationOption={suspendData.durationOption} description={suspendData.description}/>)
    }

    return(
        <ModalTemplate title={"Suspend User"} width="400px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography>Username: {username}</Typography>

                <TextField size="small" name="durationOption" label={"duration"} onChange={onChange} value={suspendData.durationOption} select>
                    {
                        dateOption.map((option, index) => 
                            (
                                <MenuItem key={index} value={index}>{option.label}</MenuItem>
                            )
                        )
                    }
                </TextField>
                <TextField size="small" rows={5} name="description" onChange={onChange} label={"description"} value={suspendData.description} multiline/>
            </Box>
            
            <ModalConfirmButton clickEvent={OpenSuspendUserConfirmModal} name={"Suspend"} buttonType={"Important"}/>
        </ModalTemplate>
    )
}

export default SuspendUserModal