import { ChangeEvent, FC, useState } from 'react'
import { MenuItem, TextField, Box } from '@mui/material';

// UI Fragment
import ModalConfirmButton from '../../UIFragment/ModalConfirmButton';

// Template
import ModalTemplate from '../../Templates/ModalTemplate';

// Another Modal
import EditUserConfirmModal from '../Confirmation/User/EditUserConfirmModal';

// Context
import { useModal } from '../../../Context/ModalContext';

// Models
import { DetailsInterfaceForSuspend } from '../../../Model/ResultModel';
import { EditModalInterface } from '../../../Model/ModelForModal';

// Data (Dropdown option and CSS Syntax)

import { TransferDateToISOString } from '../../../Controller/OtherController';
import { ModalBodySyntax } from '../../../Data/Style';
import { EditSuspendUserInputField } from '../../../Data/TextFieldsData';
import { DataValidateField } from '../../../Controller/ValidateController';

const EditSuspendUserModal:FC<EditModalInterface> = (editModalData) => 
{
    const { value, editData, compareData } = editModalData;
    const {handleOpen} = useModal();    
    const { _id, userID, description, startDate, dueDate, status } = editData as DetailsInterfaceForSuspend;

    const suspendedIDToString = _id.toString() as string;
    const startDateToString = TransferDateToISOString(startDate as Date) as string;
    const dueDateToString = TransferDateToISOString(dueDate as Date) as string;
    const descriptionToString = description.toString() as string;
    const [banData, setSuspendData] = useState<DetailsInterfaceForSuspend>({_id: suspendedIDToString, userID:userID, startDate: startDateToString, dueDate: dueDateToString, description: descriptionToString, status: status });
    
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({description: ""});
    const [helperTexts, setHelperText] = useState({description: ""});

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setSuspendData({...banData, [name] : value})
    }

    const HandleDataValidate = async () => 
    {
        let validationPassed = true;
        const newErrors = { ...errors };
        const newHelperTexts = { ...helperTexts };
        setIsSubmitted(true);
    
        Object.keys(banData).forEach((field) => 
        {
            if(["_id", "userID", "startDate", "dueDate", "status"].includes(field))
            {
                return;
            }
            
            const { helperText, error, success } = DataValidateField(field, banData[field as keyof DetailsInterfaceForSuspend] as string);
            newHelperTexts[field as keyof typeof newHelperTexts] = helperText;
            newErrors[field as keyof typeof newErrors] = error;
    
            if(!success)
            {
                validationPassed = false;
            }
        });
    
        setHelperText(newHelperTexts);
        setErrors(newErrors);

        if(validationPassed)
        {
            handleOpen(<EditUserConfirmModal value={value} editData={banData} compareData={compareData} />)
        }
    }

    return(
        <ModalTemplate title={"Edit Suspend Record"} width="400px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                {
                    EditSuspendUserInputField.map((field, index) => 
                    (
                        <TextField key={index} label={field.label} name={field.name} value={banData[field.name as keyof DetailsInterfaceForSuspend]}
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

            <ModalConfirmButton clickEvent={HandleDataValidate} name={"Edit"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default EditSuspendUserModal;