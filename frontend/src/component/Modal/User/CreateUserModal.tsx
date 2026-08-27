import { ChangeEvent, useState } from 'react'
import { Box, MenuItem, TextField } from '@mui/material'

// Another Modals
import CreateUserConfirmModal from '../Confirmation/User/CreateUserConfirmModal';

// Models
import ModalTemplate from '../../Templates/ModalTemplate';

import { GetCurrentDate } from '../../../Controller/OtherController';
import { UserDataInterface } from '../../../Model/UserTableModel';

// UI Fragment
import ModalConfirmButton from '../../UIFragment/ModalConfirmButton';

// Data And Object(For Dropdown Data and css syntax)
import { ModalBodySyntax } from '../../../Data/Style';
import { CreateUserInputField } from '../../../Data/TextFieldsData';
import { useDataValidation } from '../../../customhook/DataValidation';

const validationList = {username: "", email: "", genre: "", role: "", status: "", gender: "", birthDay: ""};
const ignoreList = ["gender", "role", "status"];

const CreateUserModal = () => 
{
    const [user, setUser] = useState({username: "", password: "", email: "", role: "User", status: "", gender: "Male", birthDay: GetCurrentDate("String") as Date});

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        setUser({...user, [event.target.name] : event.target.value})
    }

    const { isSubmitted, errors, helperTexts, handleDataValidate } = useDataValidation<UserDataInterface>(user, validationList, ignoreList, <CreateUserConfirmModal {...user}/>);
    
    return(
        <ModalTemplate title={"Create User Record"} width="400px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
            {
                CreateUserInputField.map((field, index) => 
                (
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
            
            <ModalConfirmButton clickEvent={handleDataValidate} name={"Create"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default CreateUserModal;