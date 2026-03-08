import { FC, useCallback, useContext, useEffect, useState } from "react"
import ModalTemplate from "../../../Templates/ModalTemplate"
import { EditModalInterface } from "../../../../Model/ModelForModal"
import EditContactModal from "../../Contact/EditContactModal";
import { useModal } from "../../../../Context/ModalContext";
import { useContactContext } from "../../../../Context/Book/ContactContext";
import { Box, Typography } from "@mui/material";
import { ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../Data/Style";
import ModalConfirmButton from "../../../UIFragment/ModalConfirmButton";
import { ContactInterface } from "../../../../Model/ResultModel";
import { AlertContext } from "../../../../Context/AlertContext";

const EditContactConfirmModal:FC<EditModalInterface> = (data) => 
{
    const { value, compareData, editData } = data;
    const { handleOpen, handleClose } = useModal();
    const { editContactData } = useContactContext();
    const alertContext = useContext(AlertContext);

    const [differences, setDifferences] = useState<string[]>([]);
    const type = value === 0 ? "Author" : "Publisher";

    const returnEditDefinitionModal = () => 
    {
        handleOpen(<EditContactModal value={value} editData={editData} compareData={compareData}/>);
    }

    const editDefinitionAction = async () => 
    {
        let response: Response;

        switch(value)
        {
            case 0:
                response = await editContactData(type, compareData._id, editData.author, detectNullData(editData.phoneNumber), detectNullData(editData.email));
                break;

            case 1:
                response = await editContactData(type, compareData._id, editData.publisher, detectNullData(editData.phoneNumber), detectNullData(editData.email));
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
                    alertContext.setAlertConfig({ AlertType: "success", Message: `Edit ${type} record successfully!` });
                    setTimeout(() => { handleClose() }, 2000);
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: `Failed to edit ${type} record! Please try again later` });
                    break;
            }
        }
    }

    const detectNullData = (data:string) =>
    {
        return data === "" ? "N/A" : data;
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
            
            <ModalConfirmButton clickEvent={editDefinitionAction} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    )
}

export default EditContactConfirmModal