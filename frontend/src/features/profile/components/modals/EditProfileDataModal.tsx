import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Box, Button, FormControl, MenuItem, TextField } from "@mui/material";
import ModalTemplate from "../../../../component/Templates/ModalTemplate";
import { AlertContext } from "../../../../Context/AlertContext";
import { useModal } from "../../../../Context/ModalContext";
import { useAuthContext } from "../../../../Context/User/AuthContext";
import { ModifyProfileDataController } from "../../../../Controller/UserController/UserPutController";
import { DataValidateField } from "../../../../Controller/ValidateController";
import { displayAsColumn } from "../../../../Data/Style";
import { GetResultInterface } from "../../../../Model/ResultModel";



type EditProfileDataOption = "username" | "password";

interface EditDataInterface
{
    username?: string;
    password?: string;
    confirmPassword?: string;
}

const useEditProfileDataModal = () => 
{
    const [option, setOption] = useState<EditProfileDataOption>("username");
    const [editedData, setEditData] = useState<EditDataInterface>({ username: "", password: "", confirmPassword: "" });

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        setOption(event.target.value as EditProfileDataOption);
    }

    const onEdit = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setEditData({...editedData, [name]: value})
    }

    return {option, editedData, onChange, onEdit};
}

const useHandleDataValidate = (option: EditProfileDataOption, editedData: EditDataInterface, confirmToEdit: () => void) => 
{
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({email: "", password: "", confirmPassword: ""});
    const [helperTexts, setHelperText] = useState({email: "", password: "", confirmPassword: ""});

    const handleDataValidate = async (event: FormEvent) => 
    {
        let validationPassed = true;
        const newErrors = { ...errors };
        const newHelperTexts = { ...helperTexts };
        setIsSubmitted(true);
    
        Object.keys(editedData).forEach((field) => 
        {
            const ignoreList = option === "username" ? ["password", "confirmPassword"] : ["username","confirmPassword"];
            
            if(ignoreList.includes(field))
            {
                return;
            }

            const { helperText, error, success } = DataValidateField(field, editedData[field as keyof { username?: string; password?: string }]);
            newHelperTexts[field as keyof typeof newHelperTexts] = helperText;
            newErrors[field as keyof typeof newErrors] = error;

            if(!success) 
            {
                validationPassed = false;
            }
        });

        if(editedData.confirmPassword?.trim() !== editedData.password?.trim())
        {
            newHelperTexts.confirmPassword = "Confirm password does not pair with password!";
            newErrors.confirmPassword = "Confirm password does not pair with password!";
            validationPassed = false;
        }

        setHelperText(newHelperTexts);
        setErrors(newErrors);

        
        if(validationPassed)
        {
            confirmToEdit();
        } 
    };

    return {isSubmitted, errors, helperTexts, handleDataValidate};
}

const useConfirmToEdit = (option: EditProfileDataOption, editedData: { username?: string; password?: string }) => 
{
    const {handleClose} = useModal();

    const alertContext = useContext(AlertContext);

    const confirmToEdit = async () => 
    {
        const bodyData = option === "username" ? {username: editedData.username} : {password: editedData.password};

        const response = await ModifyProfileDataController(option, bodyData);

        const result: GetResultInterface = await response.json();

        if (alertContext && alertContext.setAlertConfig) 
        {
            if(!response.ok)
            {
                alertContext.setAlertConfig({ AlertType: "error", Message: result.error as string });
                return;
            }

            alertContext.setAlertConfig({ AlertType: "success", Message: result.message as string });
            
            setTimeout(() => 
            {
                handleClose();
                window.location.reload()
            }, 2000);
        }
    }

    return {confirmToEdit};
}

const EditProfileDataModal = () => 
{
    const {option, editedData, onChange, onEdit} = useEditProfileDataModal();
    const {confirmToEdit} = useConfirmToEdit(option, editedData);
    const {isSubmitted, errors, helperTexts, handleDataValidate} = useHandleDataValidate(option, editedData, confirmToEdit);

    return(
        <ModalTemplate title={"Edit Profile Data"} width="400px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={displayAsColumn}>
                <FormControl sx={{ marginBottom: 3, marginTop: 3, width: '100%' }}>
                    <TextField label="Edit option" size="small" value={option} name={option} onChange={onChange} select>
                        <MenuItem value="username">username</MenuItem>
                        <MenuItem value="password">password</MenuItem>
                    </TextField>
                </FormControl>

                <FormControl sx={{ marginBottom: 3, width: '100%' }}>
                    <TextField label={`New ${option}`} type={option === "username" ? "text" : "password"} size="small" name={option} 
                        value={option === "password" ? editedData.password : editedData.username} onChange={onEdit}  
                        helperText={isSubmitted && helperTexts[option as unknown as keyof typeof helperTexts]}
                        error={isSubmitted && errors[option as unknown as keyof typeof errors] !== ""} required/>
                </FormControl>

                {
                    option === "password" &&
                    <FormControl sx={{ marginBottom: 3, width: '100%' }}>
                        <TextField type="password" label={"Confirm Password"} size="small" name="confirmPassword" value={editedData.confirmPassword} 
                            helperText={isSubmitted && helperTexts["confirmPassword"]}
                            error={isSubmitted && errors["confirmPassword"] !== ""}
                            onChange={onEdit}required />
                    </FormControl>
                }
            </Box>
            
            <Button variant="contained" onClick={handleDataValidate}>Edit</Button>
        </ModalTemplate>
    );
}

export default EditProfileDataModal