import { ChangeEvent, FC, useState } from 'react'
import { MenuItem, TextField, Box } from '@mui/material';

// UI Fragment
import ModalConfirmButton from '../../UIFragment/ModalConfirmButton';

// Template
import ModalTemplate from '../../Templates/ModalTemplate';

// Another Modal
import EditUserConfirmModal from '../Confirmation/User/EditUserConfirmModal';

// Models
import { UserResultDataInterface } from '../../../Model/ResultModel';
import { UserDataInterface } from '../../../Model/UserTableModel';
import { EditModalInterface } from '../../../Model/ModelForModal';
import { ModalBodySyntax } from '../../../Data/Style';
import { EditUserInputField } from '../../../Data/TextFieldsData';
import { useDataValidation } from '../../../customhook/DataValidation';

const validationList = {username: "", email: "", genre: "", role: "", status: "", gender: ""};
const ignoreList = ["_id", "gender", "role", "status"];

const useEditDataHandler = (editData: UserResultDataInterface) => 
{
    const [user, setUser] = useState<UserResultDataInterface>(
        { _id: editData._id, username: editData.username, email: editData.email, role: editData.role, status: editData.status, gender: editData.gender}
    );

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setUser({...user, [name] : value})
    }

    return { user, onChange };
}

const EditUserModal:FC<EditModalInterface> = (editModalData) => 
{
    const { value, editData, compareData } = editModalData;
    
    const { user, onChange } = useEditDataHandler(editData as UserResultDataInterface);

    const {isSubmitted, errors, helperTexts, handleDataValidate} = useDataValidation<UserDataInterface>(
        user, validationList, ignoreList, 
        <EditUserConfirmModal value={value} editData={user} compareData={compareData} />
    );   
    
    return(
        <ModalTemplate title={"Edit User Record"} width="400px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                {
                    EditUserInputField.map((field, index) => (
                        <TextField key={index} label={field.label} name={field.name} value={user[field.name as keyof UserDataInterface]}
                            type={field.type} size="small" onChange={onChange} select={field.select} 
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

export default EditUserModal;