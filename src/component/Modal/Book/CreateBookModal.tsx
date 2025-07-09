import { ChangeEvent, FC, useMemo, useState } from 'react';
import { TextField, Button, Box, MenuItem, Typography, Avatar } from '@mui/material';

// Template
import ModalTemplate from '../../Templates/ModalTemplate';

// Another Modal
import CreateBookConfirmModal from '../Confirmation/Book/CreateBookConfirmModal';

// Context
import { useModal } from '../../../Context/ModalContext';

// Models
import { BookTableDataInterface } from '../../../Model/BookTableModel';
import { CreateBookModalInterface } from '../../../Model/ModelForModal';

// Data (CSS Syntax and dropdown data)
import { useDefinitionContext } from '../../../Context/Book/DefinitionContext';
import { BookImageFormat, DeleteButton, displayAsColumn, displayAsRow, ModalBodySyntax } from '../../../ArraysAndObjects/Style';
import { useContactContext } from '../../../Context/Book/ContactContext';
import { ContactInterface, DefinitionInterface } from '../../../Model/ResultModel';
import { GetCurrentDate } from '../../../Controller/OtherController';
import { DataValidateField } from '../../../Controller/ValidateController';

const CreateBookModal: FC<CreateBookModalInterface> = ({...bookData}) => 
{
    const { handleOpen } = useModal();
    const { definition } = useDefinitionContext();
    const { contact } = useContactContext();

    const { image, imageURL, bookname, language, genre, author, publisher, description, publishDate } = bookData;

    const [ imageFile, setImageFile ] = useState<File | null>(image as File || null);
    const [ previewUrl, setPreviewUrl ] = useState<string | null>(imageURL as string || null);
    const [ book, setBook ] = useState(
        { 
            bookname: bookname || "", language: language || "", genre: genre || "", author: author || "", publisher: publisher || "",  
            description: description || "", publishDate: publishDate || GetCurrentDate("String") as string
        }
    );

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({bookname: "", author: "", genre: "", publisher: "", publishDate: "", description: ""});
    const [helperTexts, setHelperText] = useState({bookname: "", author: "", genre: "", publisher: "", publishDate: "", description: ""});
    
    // For book filter
    const CreateBookInputField = useMemo(() => 
    [
        {name: "bookname", label: "Book Name", type:"text", select: false, slotProps: {}, multiline: false, rows: 1 },
        {name: "language", label: "Language", type:"text", select: true, options:definition.Language, slotProps: {}, multiline: false, rows: 1},
        {name: "genre", label: "Genre", type:"text", select: true, options:definition.Genre, slotProps:{}, multiline: false, rows: 1},
        {name: "author", label: "Author", type:"text", select: true, options:contact.Author, slotProps:{}, multiline: false, rows: 1},
        {name: "publisher", label: "Publisher", type:"text", select: true, options:contact.Publisher, slotProps:{}, multiline: false, rows: 1},
        {name: "publishDate", label: "Publish Date", type:"Date", select: false, slotProps:{}, multiline: false, rows: 1},
        {name: "description", label: "Description", type: "text", select: false, slotProps:{}, multiline: true, rows: 8}
    ],[definition])

    const onSelectChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;

        setBook({ ...book, [name]: value });
    }

    // Handle file upload
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const target = event.target;
        const file = target.files?.[0];
        if (file) 
        {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        }
        target.value = '';
    };

    const removeImage = () => 
    {
        if (previewUrl) 
        {
            URL.revokeObjectURL(previewUrl);
            setImageFile(null);
            setPreviewUrl(null); 
        }
    };

    const HandleDataValidate = async () => 
    {
        let validationPassed = true;
        const newErrors = { ...errors };
        const newHelperTexts = { ...helperTexts };
        setIsSubmitted(true);
    
        Object.keys(book).forEach((field) => 
        {
            if(["publishDate", "description"].includes(field))
            {
                return;
            }
            
            const { helperText, error, success } = DataValidateField(field, book[field as keyof BookTableDataInterface]) || {};
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
            handleOpen(<CreateBookConfirmModal data={{...book, image: imageFile, imageURL: previewUrl}}/>);
        }
    }

    return (
        <ModalTemplate title={"Create Book Record"} minWidth="500px" maxWidth="750px" width="100%" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Box sx={{...displayAsRow, marginBottom: '10px'}}>
                    <Box sx={{...displayAsColumn, justifyContent: 'center', alignItems: 'center', width: '40%'}}>
                        {previewUrl ?
                            (
                            /*
                                Vanilla HTML Element for display image
                                <img src={previewUrl} style={{ width: '150px', height: 'auto', borderRadius: 8 }}/>
                            */
                                <Avatar src={previewUrl} alt="Preview" variant="rounded" sx={BookImageFormat}/>
                            )
                            :
                            <Typography>No Image Uploaded</Typography>
                        }
                        
                        <Button variant="contained" component="label" sx={{ width: '100%', marginTop: '10px' }}>
                            Upload Image {<input hidden type="file" accept="image/*" onChange={handleFileChange} /> }
                        </Button>

                        {
                            previewUrl && 
                            (
                                <Button variant="contained" sx={{ backgroundColor:DeleteButton.backgroundColor, width: '100%', marginTop: '10px' }} onClick={removeImage}>Remove Image</Button>
                            )
                        }
                    </Box>

                    <Box sx={{...displayAsColumn, marginLeft: '20px', gap: '20px 100px', width: '60%'}}>
                    {
                        CreateBookInputField.map((field, index) => 
                        (
                            <TextField key={index} label={field.label} name={field.name} value={book[field.name as keyof BookTableDataInterface]} 
                                helperText={isSubmitted && helperTexts[field.name as keyof typeof helperTexts]}
                                error={isSubmitted && errors[field.name as keyof typeof errors] !== ""} select={field.select} 
                                slotProps={field.slotProps} multiline={field.multiline} rows={field.rows} type={field.type} size="small" onChange={onSelectChange}
                            >
                            {
                                field.options && field.options.map((option, index) => 
                                    {
                                        const definitionOption = option as DefinitionInterface;
                                        const contactOption = option as ContactInterface;

                                        const fieldMap:Record<string, string | undefined> = 
                                        {
                                            "genre": definitionOption.genre as string,
                                            "language": definitionOption.language as string,
                                            "author": contactOption.author as string,
                                            "publisher": contactOption.publisher as string
                                        }

                                        let value = fieldMap[field.name];

                                        return(<MenuItem key={index} value={value}>{value}</MenuItem> )
                                    }
                                )
                            }
                            </TextField>
                        ))
                    }
                    </Box>
                </Box>
            </Box>
            <Button variant='contained' onClick={HandleDataValidate}>Create</Button>
        </ModalTemplate>
    );
}

export default CreateBookModal;
