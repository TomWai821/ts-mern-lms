import { ChangeEvent, FC, useState } from 'react'
import { Box,  TextField } from '@mui/material'


// Context
import { useModal } from '../../../Context/ModalContext';

// Another Modal
import CreateDefinitionConfirmModal from '../Confirmation/Definition/CreateDefinitionConfirmModal';

// Models
import { CreateModalInterface } from '../../../Model/ModelForModal';

// UI Fragment
import ModalTemplate from '../../Templates/ModalTemplate';
import ModalConfirmButton from '../../UIFragment/ModalConfirmButton';

// Useful Array/Object (data)
import { ModalBodySyntax } from '../../../Data/Style';

const CreateDefinitionModal:FC<CreateModalInterface> = (createModalData) => 
{
    const {value, data} = createModalData;
    const {handleOpen} = useModal();
    const type = value === 0 ? "Genre": "Language";

    const [definition, setDefinition] = useState({ genre: data?.genre ?? "", language: data?.language ?? "", shortName: data?.shortName ?? ""});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({ genre: "", language: "", shortName: ""});
    const [helperTexts, setHelperText] = useState({genre: "", language: "", shortName: ""});

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setDefinition({...definition, [name]: value})
    }

    const openConfirmModal = () => 
    {
        setIsSubmitted(true);
        switch(value)
        {
            case 0:
                if(definition.genre === "")
                {
                    setHelperText((prev) => ({...prev, genre: "Genre should not be null!"}));
                    setErrors((prev) =>  ({...prev, genre: "Genre should not be null!"}));
                    return;
                }
                break;

            case 1:
                if(definition.language === "")
                {
                    setHelperText((prev) => ({...prev, language: "Language should not be null!"}));
                    setErrors((prev) =>  ({...prev, language: "Language should not be null!"}));
                    return;
                }
                break;
        }

        handleOpen(<CreateDefinitionConfirmModal value={value} data={definition}/>);
    }
    
    return(
        <ModalTemplate title={`Create ${type} Record`} width="400px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
            {
                value === 0 ?
                <TextField label="Genre" name="genre" value={definition.genre} type="text" size="small" onChange={onChange}
                    helperText={isSubmitted && helperTexts["genre"]} error={isSubmitted && errors["genre"] !== ""} />
                :
                <TextField label="Language" name="language" value={definition.language} type="text" size="small" onChange={onChange}
                    helperText={isSubmitted && helperTexts["language"]} error={isSubmitted && errors["language"] !== ""} />
            }
                <TextField label="Short Name" name="shortName" value={definition.shortName} type="text" size="small" onChange={onChange}/>
            </Box>
            
            <ModalConfirmButton clickEvent={openConfirmModal} name={"Create"} buttonType={""}/>
        </ModalTemplate>
    );
}

export default CreateDefinitionModal;