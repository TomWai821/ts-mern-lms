import { ChangeEvent, FC, useState } from 'react'
import { TextField, Box } from '@mui/material';

// UI Fragment
import ModalConfirmButton from '../../UIFragment/ModalConfirmButton';

// Template
import ModalTemplate from '../../Templates/ModalTemplate';

// Another Modal
import EditDefinitionConfirmModal from '../Confirmation/Definition/EditDefinitionConfirmModal';

// Context
import { useModal } from '../../../Context/ModalContext';

// Models
import { DefinitionInterface } from '../../../Model/ResultModel';
import { EditModalInterface } from '../../../Model/ModelForModal';

// Data (Dropdown option and CSS Syntax)
import { EditGenreInputField } from '../../../Data/TextFieldsData';
import { EditLanguageInputField } from '../../../Data/TextFieldsData';
import { ModalBodySyntax } from '../../../Data/Style';

const EditDefinitionModal:FC<EditModalInterface> = (editModalData) => 
{
    const { value, editData, compareData } = editModalData;
    const {handleOpen} = useModal();
    
    const { _id, shortName, genre, language } = editData as DefinitionInterface;
    const [definitionData, setDefinitionData] = useState<DefinitionInterface>({_id:_id, shortName:shortName, genre: genre, language: language});

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({_id: "", genre: "", language: "", shortName: ""});
    const [helperTexts, setHelperText] = useState({_id: "", genre: "", language: "", shortName: ""});

    const sanitizeField = (field: string) => field.trim() === "" ? "N/A" : field;

    const setModalData = () => 
    {
        type inputFieldType = {name:string, label:string, type: string};

        const modalData:{title:string, inputfield: inputFieldType[]}[] = 
        [
            {title: "Edit Genre Definition Record", inputfield: EditGenreInputField},
            {title: "Edit Language Definition Record", inputfield: EditLanguageInputField}
        ]

        return modalData[value as number];
    }

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setDefinitionData({...definitionData, [name] : value})
    }

    const openConfirmModal = () => 
    {
        let sanitizedDefinition = {};
        setIsSubmitted(true);

        switch(value)
        {
            case 0:
                if(definitionData.genre === "")
                {
                    setHelperText((prev) => ({...prev, genre : "Genre should not be null!"}));
                    setErrors((prev) =>  ({...prev, genre : "Genre should not be null!"}));
                    return;
                }

                sanitizedDefinition =
                {
                    genre: definitionData.genre,
                    shortName: sanitizeField(definitionData.shortName)
                }
                break;

            case 1:
                if(definitionData.language === "")
                {
                    setHelperText((prev) => ({...prev, language : "Language should not be null!"}));
                    setErrors((prev) =>  ({...prev, language : "Language should not be null!"}));
                    return;
                }

                sanitizedDefinition =
                {
                    language: definitionData.language,
                    shortName: sanitizeField(definitionData.shortName)
                }
                break;
        }
        
        handleOpen(<EditDefinitionConfirmModal value={value} editData={sanitizedDefinition} compareData={compareData}/>)
    }
    
    return(
        <ModalTemplate title={setModalData().title} width="400px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                {
                    setModalData().inputfield.map((inputField, index) => 
                    (
                        <TextField key={index} label={inputField.label} name={inputField.name} onChange={onChange} 
                            value={definitionData[inputField.name as keyof DefinitionInterface] ?? ""} size="small"
                            helperText={isSubmitted ? helperTexts[inputField.name as keyof DefinitionInterface] ?? "" : ""} 
                            error={isSubmitted && (errors[inputField.name as keyof DefinitionInterface] ?? "") !== ""}
                        />
                    ))
                }
            </Box>

            <ModalConfirmButton clickEvent={openConfirmModal} name={"Edit"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default EditDefinitionModal;