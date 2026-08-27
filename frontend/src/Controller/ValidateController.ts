const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initResult = {success: false, error: "", helperText: ""};

interface IRegexResult
{
    success: boolean;
    helperText: string;
    error: string;
}

const validateMap:Record<string, (name: string, value: string) => IRegexResult> =
{
    email: EmailValidate,
    username: (name: string, value: string) => DataLengthValidate(name, value, 6),
    password: (name: string, value: string) => DataLengthValidate(name, value, 6),
    birthDay: (name: string, value: string) => BirthDayValidate(name, value, 6),
    gender: EmptyDataValidation,
    role: EmptyDataValidation,
    bookname: EmptyDataValidation,
    language: EmptyDataValidation,
    genre: EmptyDataValidation,
    author: EmptyDataValidation,
    publisher: EmptyDataValidation,
    description: EmptyDataValidation
};

export const DataValidateField = (name: string, value: string | any) => 
{

    const findValidateField = validateMap[name];

    if (!findValidateField) 
    {
        return { success: false, helperText: `Invalid field: ${name}`, error: "Validation failed" };
    }

    return findValidateField(name, value);
};

function EmailValidate(name:string, value:string): IRegexResult
{
    let {success, error, helperText} = initResult;

    if(!emailRegex.test(value) || value === "")
    {
        error = `Invalid ${name} address!`;
        helperText = `Please enter a valid ${name} address`;
    }

    if(error === "" && helperText === "")
    {
        success = true;
    }

    return {success, helperText, error};
}

function DataLengthValidate(name:string, value:string, limitLength:number): IRegexResult
{
   let {success, error, helperText} = initResult;

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

function BirthDayValidate(name:string, value:string, limitAge:number): IRegexResult
{
    let {success, error, helperText} = initResult;

    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const isOldEnough = age > limitAge || (age === limitAge && today >= new Date(birthDate.setFullYear(today.getFullYear())));

    if (isNaN(birthDate.getTime()) || !isOldEnough) 
    {
        error = `Invalid ${name}!`;
        helperText = `Only users aged ${limitAge} years and older can register`;
    }

    if(error === "" && helperText === "")
    {
        success = true;
    }

    return {success, helperText, error};
}

function EmptyDataValidation(name:string, value:string): IRegexResult
{
   let {success, error, helperText} = initResult;

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