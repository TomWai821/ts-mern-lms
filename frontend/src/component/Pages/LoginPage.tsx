import { FormEvent, ChangeEvent, useState, useContext } from 'react';

import { Box, Button, Card, CardContent, FormControl, TextField, Typography, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

// Models
import { LoginModel } from '../../Model/InputFieldModel';

// Context
import { AlertContext } from '../../Context/AlertContext';

// Another Useful Function
import { DataValidateField } from '../../Controller/ValidateController'
import { LoginController } from '../../Controller/UserController/UserPostController';
import { ChangePage } from '../../Controller/OtherController';

// Data (CSS Syntax and dropdown)
import { PageItemToCenter, PageTitleSyntax } from '../../Data/Style';
import { LoginField } from '../../Data/TextFieldsData';

const LoginPage = () => 
{
    const [Credentials, setCredentials] = useState({ email: "", password: "", stayLogin: false });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({email: "", password: ""});
    const [helperTexts, setHelperText] = useState({email: "", password: ""});

    const alertContext = useContext(AlertContext);

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
        setIsSubmitted(true);
        
        const response: Response = await LoginController(Credentials.email, Credentials.password, Credentials.stayLogin);
    
        if (alertContext && alertContext.setAlertConfig) 
        {
            switch(response.status)
            {
                case 200:
                    alertContext.setAlertConfig({ AlertType: "success", Message: "Login successfully!" });
                    setTimeout(() => { ChangePage("/") }, 2000);
                    break;

                case 401:
                    alertContext.setAlertConfig({ AlertType: "error", Message: "This user was suspend!" });
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: "Invalid email or password!" });
                    break;
            }
        }
    };
    
    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { name, value, checked, type } = event.target;
        setCredentials(prevState => ({...prevState, [name]: type === 'checkbox' ? checked : value}));
    };

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
                            label="Remember me in 30 days"
                        />
                    </FormGroup>
                    <Button variant="contained" onClick={handleDataValidate}>Login</Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
