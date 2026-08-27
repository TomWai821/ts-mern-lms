import { ChangeEvent, FC, useState } from 'react'
import { MenuItem, TextField, Box } from '@mui/material';

// UI Fragment
import ModalConfirmButton from '../../UIFragment/ModalConfirmButton';

// Template
import ModalTemplate from '../../Templates/ModalTemplate';

// Another Modal
import EditUserConfirmModal from '../Confirmation/User/EditUserConfirmModal';

// Models
import { DetailsInterfaceForSuspend } from '../../../Model/ResultModel';
import { EditModalInterface } from '../../../Model/ModelForModal';

// Data (Dropdown option and CSS Syntax)

import { TransferDateToISOString } from '../../../Controller/OtherController';
import { ModalBodySyntax } from '../../../Data/Style';
import { EditSuspendUserInputField } from '../../../Data/TextFieldsData';
import { useDataValidation } from '../../../customhook/DataValidation';

const validationList = {description: ""};
const ignoreList = ["_id", "userID", "startDate", "dueDate", "status"];

const useSuspendUserDataHandler = (editData: DetailsInterfaceForSuspend) => 
{
    const suspendedIDToString = editData._id.toString() as string;
    const startDateToString = TransferDateToISOString(editData.startDate as Date) as string;
    const dueDateToString = TransferDateToISOString(editData.dueDate as Date) as string;
    const descriptionToString = editData.description.toString() as string;

    const [suspendData, setSuspendData] = useState<DetailsInterfaceForSuspend>(
        { _id: suspendedIDToString, userID: editData.userID, startDate: startDateToString, dueDate: dueDateToString, description: descriptionToString, status: editData.status }
    );

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setSuspendData({...suspendData, [name] : value})
    }

    return {suspendData, onChange};
}

const EditSuspendUserModal:FC<EditModalInterface> = (editModalData) => 
{
    const { value, editData, compareData } = editModalData; 
    const { suspendData, onChange } = useSuspendUserDataHandler(editData as DetailsInterfaceForSuspend);
    
    const {isSubmitted, errors, helperTexts, handleDataValidate} = useDataValidation<DetailsInterfaceForSuspend>(
        suspendData, validationList, ignoreList, 
        <EditUserConfirmModal value={value} editData={suspendData} compareData={compareData} />
    );

    return(
        <ModalTemplate title={"Edit Suspend Record"} width="400px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                {
                    EditSuspendUserInputField.map((field, index) => 
                    (
                        <TextField key={index} label={field.label} name={field.name} value={suspendData[field.name as keyof DetailsInterfaceForSuspend]}
                            type={field.type} size="small" onChange={onChange} select={field.select} multiline={field.rows > 1} rows={field.rows} disabled={field.disable}
                            helperText={isSubmitted && helperTexts[field.name as keyof typeof helperTexts]}
                            error={isSubmitted && errors[field.name as keyof typeof errors] !== ""}>
                            {
                                field.select && field.options.map((option, index) => 
                                (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))  
                            }
                        </TextField>
                    ))   
                }
            </Box>

            <ModalConfirmButton clickEvent={handleDataValidate} name={"Edit"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default EditSuspendUserModal;