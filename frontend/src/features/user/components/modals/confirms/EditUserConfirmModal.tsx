import { Box, Typography } from "@mui/material";
import { FC, ReactElement, useMemo } from "react";

// Context
import { useModal } from "../../../../../Context/ModalContext";

// Models
import { DetailsInterfaceForSuspend, UserResultDataInterface } from "../../../../../Model/ResultModel";
import { UserDataInterface } from "../../../../../Model/UserTableModel";
import { EditModalInterface } from "../../../../../Model/ModelForModal";

// Template for modal
import ModalTemplate from "../../../../../component/Templates/ModalTemplate";

// Another Modal
import EditSuspendUserModal from "../actions/EditSuspendUserModal";
import EditUserModal from "../actions/EditUserModal";

// Useful function
import { TransferDateToISOString } from "../../../../../Controller/OtherController";

// UI fragment
import ModalConfirmButton from "../../../../../component/UIFragment/ModalConfirmButton";

// Data (CSS syntax)
import { ModalBodySyntax, ModalRemarkSyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";
import ExpandableTypography from "../../../../../component/UIFragment/ExpandableTypography";
import { useUserAction } from "../../../../../hooks/actionhook/useUserAction";
import { useSuspendUserAction } from "../../../../../hooks/actionhook/useSuspendUserAction";

const EditUserData = (tabValue: number, differences: ReactElement[], compareData: UserResultDataInterface | DetailsInterfaceForSuspend, editData: UserResultDataInterface | DetailsInterfaceForSuspend) =>
{
    const {EditUser} = useUserAction();
    const {EditSuspendUser} = useSuspendUserAction();

    if(differences.length > 0)
    {
        switch(tabValue)
        {
            case 0:
                const CompareData = compareData as UserResultDataInterface;
                const EditData = editData as UserDataInterface;
                EditUser(CompareData._id, EditData.username, EditData.email, EditData.role, EditData.gender);
                break;

            case 1:
                const CompareSuspendUserData = compareData as DetailsInterfaceForSuspend;
                const EditSuspendUserData = editData as DetailsInterfaceForSuspend;
                EditSuspendUser(EditSuspendUserData.userID as string, CompareSuspendUserData._id, EditSuspendUserData.dueDate as Date, EditSuspendUserData.description);
                break;

            default:
                console.log("Invalid value");
                return;
        }
    }
}


const CompareSuspendUserDifference = (differences: ReactElement[], editData: DetailsInterfaceForSuspend, compareData: DetailsInterfaceForSuspend) =>
{
    const ignoreList = ["startDate", "dueDate", "description"];

    for (const key in editData) 
    {
        if (Object.prototype.hasOwnProperty.call(compareData, key) && Object.prototype.hasOwnProperty.call(editData, key) && !ignoreList.includes(key)) 
        {
            const editValue = (editData as any)[key];
            const compareValue = (compareData as any)[key];
    
            let formattedCompareValue = compareValue;
            let formattedEditValue = editValue;
    
            if (["startDate", "dueDate"].includes(key)) 
            {
                formattedCompareValue = TransferDateToISOString(compareValue).split("T")[0];
                formattedEditValue = TransferDateToISOString(editValue).split("T")[0];
            }
    
            if (formattedCompareValue !== formattedEditValue) 
            {
                const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                differences.push(<Typography key={key}>{`- ${capitalizedKey}: ${formattedCompareValue} -> ${formattedEditValue}`}</Typography>);
            }
        }
    }

    if ((compareData as DetailsInterfaceForSuspend).description?.trim() !== (editData as DetailsInterfaceForSuspend).description?.trim()) 
    {
        differences.push(
            <ExpandableTypography title={"Description"} key={"description"}>
                {`${(compareData as DetailsInterfaceForSuspend).description} -> ${(editData as DetailsInterfaceForSuspend).description}`}
            </ExpandableTypography>
        );
    }

    return differences;
}

const CompareUserDifference = (differences: ReactElement[], editData: UserDataInterface, compareData: UserDataInterface) =>
{
    for (const key in editData) 
    {
        if (Object.prototype.hasOwnProperty.call(compareData, key) && Object.prototype.hasOwnProperty.call(editData, key)) 
        {
            const editValue = (editData as any)[key];
            const compareValue = (compareData as any)[key];

            let formattedCompareValue = compareValue;
            let formattedEditValue = editValue;

            if (formattedCompareValue !== formattedEditValue) 
            {
                const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                differences.push(<Typography key={key}>{`- ${capitalizedKey}: ${formattedCompareValue} -> ${formattedEditValue}`}</Typography>);
            }
        }
    }
    return differences;
}

const EditUserConfirmModal:FC<EditModalInterface> = (editModalData) => 
{
    const {value, editData, compareData} = editModalData;
    const {handleOpen} = useModal();
    
    const type = value === 0 ? "User" : "Suspend User";

    const differences = useMemo(() =>
    {
        let differences: ReactElement[] = [];

        switch(value)
        {
            case 1:
                differences = CompareSuspendUserDifference(differences, editData as DetailsInterfaceForSuspend, compareData as DetailsInterfaceForSuspend);
                break;

            case 2:
                differences = CompareUserDifference(differences, editData as UserDataInterface, compareData as UserDataInterface);
                break;
        }

        if (differences.length === 0) 
        {
            differences.push(<Typography key={"nothingChange"}>- No Change detected</Typography>);
        }
        return differences;
    }, [value, editData, compareData]);

    const returnEditUserModal = () =>
    {
        switch(value)
        {
            case 0:
                handleOpen(<EditUserModal editData={editData} compareData={compareData} value={value} />);
                break;
            
            case 1:
                handleOpen(<EditSuspendUserModal editData={editData} compareData={compareData} value={value}/>);
                break;
        }
        
    }

    return(
        <ModalTemplate title={`Edit ${type} Record Confirmation`} width="400px" cancelButtonName={"No"} cancelButtonEvent={returnEditUserModal}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>Do you want to edit this User record?</Typography>
                <Typography sx={ModalRemarkSyntax}>Changes:</Typography>
                {differences}
                <Typography sx={ModalRemarkSyntax}>Please ensure this information is correct</Typography>
            </Box>
            
            <ModalConfirmButton clickEvent={() => EditUserData(value as number, differences, compareData, editData)} name={"Yes"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default EditUserConfirmModal;
