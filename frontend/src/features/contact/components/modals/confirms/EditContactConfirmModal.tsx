import { FC, useCallback, useEffect, useState } from "react"
import ModalTemplate from "../../../../../component/Templates/ModalTemplate"
import { EditModalInterface } from "../../../../../Model/ModelForModal"
import EditContactModal from "../actions/EditContactModal";
import { useModal } from "../../../../../Context/ModalContext";
import { Box, Typography } from "@mui/material";
import { ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";
import ModalConfirmButton from "../../../../../component/UIFragment/ModalConfirmButton";
import { ContactInterface } from "../../../../../Model/ResultModel";
import { useContactAction } from "../../../../../hooks/actionhook/useContactAction";

const EditContactConfirmModal:FC<EditModalInterface> = (data) => 
{
    const { value, compareData, editData } = data;

    const { EditContact } = useContactAction();
    const { handleOpen } = useModal();

    const [differences, setDifferences] = useState<string[]>([]);
    const type = value === 0 ? "Author" : "Publisher";

    const returnEditDefinitionModal = () => 
    {
        handleOpen(<EditContactModal value={value} editData={editData} compareData={compareData}/>);
    }

    const compareDifference = useCallback((editData: ContactInterface, compareData: ContactInterface) => 
    {
        let ignoreList: string | string[] = [];

        switch(value)
        {   
            case 0:
                ignoreList = ["publisher"];
                break;

            case 1:
                ignoreList = ["author"];
                break;
        }

        const newDifferences = [];
        for(const key in editData)
        {
            if(ignoreList.includes(key))
            {
                continue;
            }

            if(editData[key as keyof ContactInterface] !== compareData[key as keyof ContactInterface])
            {
                const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);

                if(editData[key as keyof ContactInterface] !== "")
                {
                    newDifferences.push(`${capitalizedKey}: ${compareData[key as keyof ContactInterface]} -> ${editData[key as keyof ContactInterface]}`);
                }
                else
                {
                    newDifferences.push(`${capitalizedKey}: ${compareData[key as keyof ContactInterface]} -> N/A`);
                }

            }
        }
        setDifferences(newDifferences);
    },[value])

    useEffect(() => 
    {
        compareDifference(editData as ContactInterface, compareData as ContactInterface);
    },[editData, compareData, compareDifference]);

    return(
        <ModalTemplate title={`Edit ${type} Record`} width="400px" cancelButtonName={"Exit"} cancelButtonEvent={returnEditDefinitionModal}>
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
            
            <ModalConfirmButton clickEvent={() => EditContact(type, compareData, editData)} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    )
}

export default EditContactConfirmModal