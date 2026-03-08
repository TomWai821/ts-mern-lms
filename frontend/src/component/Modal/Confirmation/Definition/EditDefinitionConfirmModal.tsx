import { Box, Typography } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";

// Models
import { DefinitionInterface } from "../../../../Model/ResultModel";
import { EditModalInterface } from "../../../../Model/ModelForModal";

// UI fragment
import ModalConfirmButton from "../../../UIFragment/ModalConfirmButton";
import ModalTemplate from "../../../Templates/ModalTemplate";

// Context
import { useModal } from "../../../../Context/ModalContext";
import { useDefinitionContext } from "../../../../Context/Book/DefinitionContext";

// Another Modals
import EditDefinitionModal from "../../Definition/EditDefinitionModal";

// useful Array/Objects(Data)
import { ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../Data/Style";
import { AlertContext } from "../../../../Context/AlertContext";

const EditDefinitionConfirmModal:FC<EditModalInterface>  = (data) =>
{
    const { value, compareData, editData } = data;
    const { handleOpen, handleClose } = useModal();
    const { editDefinition } = useDefinitionContext();
    const alertContext = useContext(AlertContext);

    const [differences, setDifferences] = useState<string[]>([]);
    const type = value === 0 ? "Genre" : "Language";

    const returnEditDefinitionModal = () => 
    {
        handleOpen(<EditDefinitionModal value={value} editData={editData} compareData={compareData}/>);
    }

    const editDefinitionAction = async () => 
    {
        const EditData = editData as DefinitionInterface;
        let response: Response;
        switch(type)
        {
            case "Genre":
                response = await editDefinition(type, EditData._id, EditData.shortName, EditData.genre as string);
                break;

            case "Language":
                response = await editDefinition(type, EditData._id, EditData.shortName, EditData.language as string);
                break;
        }

        if (alertContext && alertContext.setAlertConfig) 
        {
            switch(response.status)
            {
                case 200:
                    alertContext.setAlertConfig({ AlertType: "success", Message: `Edit ${type} record successfully!` });
                    setTimeout(() => { handleClose() }, 2000);
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: `Failed to edit ${type} record! Please try again later` });
                    break;
            }
        }
    }

    const compareDifference = (editData: DefinitionInterface, compareData: DefinitionInterface) => 
    {
        const newDifferences = [];
        for(const key in editData)
        {
            if(editData[key as keyof DefinitionInterface] !== compareData[key as keyof DefinitionInterface])
            {
                const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                newDifferences.push(`${capitalizedKey}: ${compareData[key as keyof DefinitionInterface]} -> ${editData[key as keyof DefinitionInterface]}`);
            }
        }
        setDifferences(newDifferences);
    }

    useEffect(() => 
    {
        compareDifference(editData as DefinitionInterface, compareData as DefinitionInterface);
    },[editData, compareData]);
    
    return(
        <ModalTemplate title={`Edit ${type} Confirmation`} width="400px"  cancelButtonName={"No"} cancelButtonEvent={returnEditDefinitionModal}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>{`Do you want to edit this ${type} record?`}</Typography>
                <Typography sx={ModalRemarkSyntax}>Changes:</Typography>
                {
                    differences.length > 0 ? differences.map((difference, index) => 
                        (
                            <Typography key={index}>{difference}</Typography>
                        )):
                   <Typography>- "No Change detected"</Typography>
                }

                <Typography sx={ModalRemarkSyntax}>Please ensure this information is correct</Typography>
            </Box>
            
            <ModalConfirmButton clickEvent={editDefinitionAction} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default EditDefinitionConfirmModal