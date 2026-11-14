import { FC } from "react";
import { Box, Typography } from "@mui/material";

// Context
import { useModal } from '../../../../../Context/ModalContext';

// UI Fragment
import ModalConfirmButton from "../../../../../component/UIFragment/ModalConfirmButton";

// Template
import ModalTemplate from '../../../../../component/Templates/ModalTemplate';

// Data (CSS Synxax)
import { ModalBodySyntax, ModalSubTitleSyntax, ModalRemarkSyntax } from "../../../../../Data/Style";

// Models
import { CreateModalInterface } from "../../../../../Model/ModelForModal";
import { DefinitionInterface } from "../../../../../Model/ResultModel";

// Another Modal
import CreateDefinitionModal from "../actions/CreateDefinitionModal";
import { useDefinitionAction } from "../../../../../hooks/actionhook/useDefinitionAction";


const CreateDefinitionConfirmModal:FC<CreateModalInterface> = (definitionData) => 
{
    const {value, data} = definitionData;
    const Data = data as DefinitionInterface;
    const type = value === 0 ? "Genre" : "Language";
 
    const { handleOpen } = useModal();
    const { CreateDefinition } = useDefinitionAction();

    const returnCreateUserModal = () => 
    {
        handleOpen(<CreateDefinitionModal {...definitionData}/>);
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
            
            <ModalConfirmButton clickEvent={() => CreateDefinition(type, data)} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default CreateDefinitionConfirmModal;
