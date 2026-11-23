import { Box, Typography } from "@mui/material";
import { FC, useMemo } from "react";

// Models
import { DefinitionInterface } from "../../../../../Model/ResultModel";
import { EditModalInterface } from "../../../../../Model/ModelForModal";

// UI fragment
import ModalConfirmButton from "../../../../../component/UIFragment/ModalConfirmButton";
import ModalTemplate from "../../../../../component/Templates/ModalTemplate";

// Context
import { useModal } from "../../../../../Context/ModalContext";

// Another Modals
import EditDefinitionModal from "../actions/EditDefinitionModal";

// useful Array/Objects(Data)
import { ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";
import { useDefinitionAction } from "../../../../../hooks/actionhook/useDefinitionAction";

const EditDefinitionConfirmModal:FC<EditModalInterface>  = (data) =>
{
    const { value, compareData, editData } = data;
    const { handleOpen } = useModal();

    const type = value === 0 ? "Genre" : "Language";

    const { EditDefinition } = useDefinitionAction();

    const returnEditDefinitionModal = () => 
    {
        handleOpen(<EditDefinitionModal value={value} editData={editData} compareData={compareData}/>);
    }

    const differences = useMemo(() =>
    {
        const editValues = editData as DefinitionInterface;
        const compareValues = compareData as DefinitionInterface;
        const newDifferences = [];
        for(const key in editValues)
        {
            if(editValues[key as keyof DefinitionInterface] !== compareValues[key as keyof DefinitionInterface])
            {
                const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                newDifferences.push(`${capitalizedKey}: ${compareValues[key as keyof DefinitionInterface]} -> ${editValues[key as keyof DefinitionInterface]}`);
            }
        }
        return newDifferences;
    }, [editData, compareData]);
    
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
                   <Typography>- No Change detected</Typography>
                }

                <Typography sx={ModalRemarkSyntax}>Please ensure this information is correct</Typography>
            </Box>
            
            <ModalConfirmButton clickEvent={() => EditDefinition(type, compareData, editData)} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default EditDefinitionConfirmModal