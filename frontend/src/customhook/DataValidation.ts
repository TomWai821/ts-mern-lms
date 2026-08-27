import { useState } from "react";
import { useModal } from "../Context/ModalContext";
import { DataValidateField } from "../Controller/ValidateController";

export const useDataValidation = <T extends Record<string, any>> (data: T, validationList: Record<string, any>,  ignoreList:string[], confirmModal: JSX.Element) => 
{
    const { handleOpen } = useModal();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState(validationList);
    const [helperTexts, setHelperText] = useState(validationList);

    const handleDataValidate = async () => 
    {
        let validationPassed = true;
        const newErrors = { ...errors };
        const newHelperTexts = { ...helperTexts };
        setIsSubmitted(true);

        Object.keys(data).forEach((field) => 
        {
            if (ignoreList.includes(field)) return;

            const { helperText, error, success } = DataValidateField(field, data[field as keyof T]) || {};
            newHelperTexts[field as keyof typeof newHelperTexts] = helperText;
            newErrors[field as keyof typeof newErrors] = error;

            if (!success) validationPassed = false;
        });

        setHelperText(newHelperTexts);
        setErrors(newErrors);

        if (validationPassed) 
        {
            handleOpen(confirmModal);
        }
    };

    return { isSubmitted, errors, helperTexts, handleDataValidate };
};
