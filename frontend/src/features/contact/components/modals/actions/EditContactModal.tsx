import { ChangeEvent, FC, useState } from "react"
import ModalTemplate from "../../../../../component/Templates/ModalTemplate"
import { EditModalInterface } from "../../../../../Model/ModelForModal"
import { Box, TextField } from "@mui/material";
import { ModalBodySyntax } from "../../../../../Data/Style";
import ModalConfirmButton from "../../../../../component/UIFragment/ModalConfirmButton";
import { useModal } from "../../../../../Context/ModalContext";
import EditContactConfirmModal from "../confirms/EditContactConfirmModal";

const EditAuthorModal:FC<EditModalInterface> = (editContactData) => 
{
    const {value, compareData, editData} = editContactData;
    const {handleOpen} = useModal();

    const [contact, setContact] = useState({author: editData?.author ?? "", publisher: editData?.publisher ?? "", phoneNumber: editData?.phoneNumber ?? "", email: editData?.email ?? ""});
    
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({author: "", publisher: ""});
    const [helperTexts, setHelperText] = useState({author: "", publisher: ""});

    const type = value === 0 ? "Author" : "Publisher";
    const sanitizeField = (field: string) => field.trim() === "" ? "N/A" : field;

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setContact({...contact, [name] : value})
    }
    
    const OpenConfirmModal = () => 
    {
        setIsSubmitted(true);
        let sanitizedContact = {};
        switch(value)
        {
            case 0:
                if(contact.author === "")
                {
                    setHelperText((prev) => ({...prev, author : "Author should not be null!"}));
                    setErrors((prev) =>  ({...prev, author : "Author should not be null!"}));
                    return;
                }

                sanitizedContact =
                {
                    author: contact.author,
                    phoneNumber: sanitizeField(contact.phoneNumber),
                    email: sanitizeField(contact.email)
                }
                break;
            
            case 1:
                if(contact.publisher === "")
                {
                    setHelperText((prev) => ({...prev, publisher : "Publisher should not be null!"}));
                    setErrors((prev) =>  ({...prev, publisher : "Publisher should not be null!"}));
                    return;
                }

                sanitizedContact =
                {
                    publisher: contact.publisher,
                    phoneNumber: sanitizeField(contact.phoneNumber),
                    email: sanitizeField(contact.email)
                };
                break;
        }
    
        handleOpen(<EditContactConfirmModal value={value as number} editData={sanitizedContact} compareData={compareData} />);
    };

    return(
        <ModalTemplate title={`Edit ${type} Record`} width="400px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
            {
                value === 0 ?
                <TextField label="Author" name="author" value={contact.author} type="text" size="small" onChange={onChange}
                    helperText={isSubmitted && helperTexts["author"]} error={isSubmitted && errors["author"] !== ""}
                />
                :
                <TextField label="Publisher" name="publisher" value={contact.publisher} type="text" size="small" onChange={onChange}
                    helperText={isSubmitted && helperTexts["publisher"]} error={isSubmitted && errors["publisher"] !== ""}
                />
            }
                <TextField label="Phone Number" name="phoneNumber" value={contact.phoneNumber} type="text" size="small" onChange={onChange}/>

                <TextField label="Email" name="email" value={contact.email} type="text" size="small" onChange={onChange}/>

            </Box>
            
            <ModalConfirmButton clickEvent={OpenConfirmModal} name={"Edit"} buttonType={""}/>
        </ModalTemplate>
    )
}

export default EditAuthorModal