const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const DataValidateField = (name: string, value: string | any) => 
{
    const validateMap = 
    [
        { validateName: "email", validateType: (name:string, value: string) => EmailValidate(name, value) },
        { validateName: "username", validateType: (name: string, value: string) => DataLengthValidate(name, value, 6) },
        { validateName: "password", validateType: (name: string, value: string) => DataLengthValidate(name, value, 6) },
        { validateName: "birthDay", validateType: (name:string, value: string) => BirthDayValidate(name, value, 6) },
        { validateName: "gender", validateType: (name: string, value: string) => EmptyDataValidation(name, value) },
        { validateName: "role", validateType: (name: string, value: string) => EmptyDataValidation(name, value) },
        { validateName: "bookname", validateType: (name: string, value: string) => EmptyDataValidation(name, value) },
        { validateName: "language", validateType: (name: string, value: string) => EmptyDataValidation(name, value) },
        { validateName: "genre", validateType: (name: string, value: string) => EmptyDataValidation(name, value) },
        { validateName: "author", validateType: (name: string, value: string) => EmptyDataValidation(name, value) },
        { validateName: "publisher", validateType: (name: string, value: string) => EmptyDataValidation(name, value) },
        { validateName: "description", validateType: (name: string, value: string) => EmptyDataValidation(name, value) }
    ];

    const findValidateField = validateMap.find((item) => item.validateName === name);

    if (!findValidateField) 
    {
        return { success: false, helperText: `Invalid field: ${name}`, error: "Validation failed" };
    }

    return findValidateField.validateType(name, value);
};

const EmailValidate = (name:string, value:string) => 
{
    let error = "";
    let helperText  = "";
    let success = false;

    if(!emailRegex.test(value) || value === "")
    {
        error = "Invalid email address!";
        helperText = "Please enter a valid email address";
    }

    if(error === "" && helperText === "")
    {
        success = true;
    }

    return {success, helperText, error};
}

const DataLengthValidate = (name:string, value:string, limitLength:number) => 
{
    let error = "";
    let helperText  = "";
    let success = false;

    if(value.length < limitLength)
    {
        error = `${name} must be at least ${limitLength} characters long`;
        helperText = `${name} must be at least ${limitLength} characters long`;
    }

    if(error === "" && helperText === "")
    {
        success = true;
    }

    return {success, helperText, error};
}

const BirthDayValidate = (name:string, value:string, limitAge:number) => 
{
    let error = "";
    let helperText  = "";
    let success = false;

    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const isOldEnough = age > limitAge || (age === limitAge && today >= new Date(birthDate.setFullYear(today.getFullYear())));

    if (isNaN(birthDate.getTime()) || !isOldEnough) 
    {
        error = "Invalid Birthday!";
        helperText = `Only users aged ${limitAge} years and older can register.`;
    }

    if(error === "" && helperText === "")
    {
        success = true;
    }

    return {success, helperText, error};
}

const EmptyDataValidation = (name:string, value:string) =>
{
    let error = "";
    let helperText  = "";
    let success = false;

    if(value === "")
    {
        error = `Invalid ${name}`;
        helperText = `${name} should not be empty!`;
    }

    if(error === "" && helperText === "")
    {
        success = true;
    }
    
    return {success, helperText, error};
}