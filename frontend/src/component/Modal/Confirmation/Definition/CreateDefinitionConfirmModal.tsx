import { FC, useContext } from "react";
import { Box, Typography } from "@mui/material";

// Context
import { useModal } from '../../../../Context/ModalContext';
import { useDefinitionContext } from "../../../../Context/Book/DefinitionContext";

// UI Fragment
import ModalConfirmButton from "../../../UIFragment/ModalConfirmButton";

// Template
import ModalTemplate from '../../../Templates/ModalTemplate';

// Data (CSS Synxax)
import { ModalBodySyntax, ModalSubTitleSyntax, ModalRemarkSyntax } from "../../../../Data/Style";

// Models
import { CreateModalInterface } from "../../../../Model/ModelForModal";
import { DefinitionInterface } from "../../../../Model/ResultModel";

// Another Modal
import CreateDefinitionModal from "../../Definition/CreateDefinitionModal";
import { AlertContext } from "../../../../Context/AlertContext";


const CreateDefinitionConfirmModal:FC<CreateModalInterface> = (definationData) => 
{
    const {value, data} = definationData;
    const Data = data as DefinitionInterface;
    const type = value === 0 ? "Genre" : "Language";
 
    const { handleOpen, handleClose } = useModal();
    const { createDefinition } = useDefinitionContext();
    const alertContext = useContext(AlertContext);

    const returnCreateUserModal = () => 
    {
        handleOpen(<CreateDefinitionModal {...definationData}/>);
    }

    const createDefinitionData = async () => 
    {
        let response: Response;

        switch(value)
        {
            case 0:
                response = await createDefinition(type, Data.shortName, Data.genre as string);
                break;

            case 1:
                response = await createDefinition(type, Data.shortName, Data.language as string);
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
                    value === 0 ? 
                    <Typography>Genre: {Data.genre !== "" ? Data.genre : "N/A"}</Typography>
                    :
                    <Typography>Language: {Data.language !== "" ? Data.language : "N/A"}</Typography>
                }
                <Typography>ShortName: {Data.shortName !== "" ? Data.shortName : "N/A"}</Typography>
                <Typography sx={ModalRemarkSyntax}>Please ensure these information are correct</Typography>
            </Box>
            
            <ModalConfirmButton clickEvent={createDefinitionData} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default CreateDefinitionConfirmModal;
