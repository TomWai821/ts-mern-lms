"use client";
import { FormEvent, ChangeEvent, useState, useContext } from 'react';

import { Box, Button, Card, CardContent, FormControl, TextField, Typography, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

// Models
import { LoginModel } from '../../Model/InputFieldModel';

// Context
import { AlertContext } from '../../Context/AlertContext';

// Another Useful Function
import { DataValidateField } from '../../Controller/ValidateController'

// Data (CSS Syntax and dropdown)
import { PageItemToCenter, PageTitleSyntax } from '../../Data/Style';
import { LoginField } from '../../Data/TextFieldsData';
import { useAuthAction } from '../../hooks/actionhook/useAuthAction';

interface ICredentials
{
    email: string;
    password: string;
    stayLogin: boolean;
}

const useCredentialsHandler = () => 
{
    const [Credentials, setCredentials] = useState({ email: "", password: "", stayLogin: false });

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { name, value, checked, type } = event.target;
        setCredentials(prevState => ({...prevState, [name]: type === 'checkbox' ? checked : value}));
    };

    return {Credentials, onChange};
}

const useCredentialsValidator = (Credentials: ICredentials) => 
{
    const { UserLogin } = useAuthAction();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({email: "", password: ""});
    const [helperTexts, setHelperText] = useState({email: "", password: ""});

    const handleDataValidate = async (event: FormEvent) => 
    {
        let validationPassed = true;
        const newErrors = { ...errors };
        const newHelperTexts = { ...helperTexts };
        setIsSubmitted(true);
    
        Object.keys(Credentials).forEach((field) => 
        {
            if(["stayLogin"].includes(field))
            {
                return;
            }

            const { helperText, error, success } = DataValidateField(field, Credentials[field as keyof LoginModel]);
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
            handleLogin(event);
        } 
    };

    const handleLogin = async (event: FormEvent) =>
    {
        event.preventDefault();
        await UserLogin(Credentials);
        setIsSubmitted(false);
    };

    return {isSubmitted, setIsSubmitted, errors, helperTexts, handleDataValidate}
}

const LoginPage = () => 
{
    const { Credentials, onChange } = useCredentialsHandler();
    const { isSubmitted, helperTexts, errors, handleDataValidate } = useCredentialsValidator(Credentials);

    return (
        <Box sx={PageItemToCenter}>
            <Card variant='outlined' sx={{ width: 600 }}>
                <CardContent>
                    <Typography sx={PageTitleSyntax}>Login</Typography>
                    {LoginField.map((field, index) => (
                        <FormControl key={index} sx={{ marginBottom: 3, width: '100%' }}>
                            <Typography>{field.label}</Typography>
                            <TextField
                                name={field.name} type={field.type}
                                placeholder={field.name}
                                value={Credentials[field.name as keyof LoginModel]}
                                helperText={isSubmitted && helperTexts[field.name as keyof typeof helperTexts]}
                                error={isSubmitted && errors[field.name as keyof typeof errors] !== ""}
                                onChange={onChange} size="small" required
                            />
                        </FormControl>
                    ))}
                    <FormGroup>
                        <FormControlLabel
                            control={ <Checkbox checked={Credentials.stayLogin} onChange={onChange} name="stayLogin"/>}
                            label="Remember me in 7 days"
                        />
                    </FormGroup>
                    <Button variant="contained" onClick={handleDataValidate}>Login</Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
