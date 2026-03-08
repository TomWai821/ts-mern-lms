import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Box, TextField, Button, MenuItem, Avatar, Typography } from '@mui/material';

// Template
import ModalTemplate from '../../Templates/ModalTemplate';

// Another Modal
import EditBookConfirmModal from '../Confirmation/Book/EditBookConfirmModal';

// Context
import { useModal } from '../../../Context/ModalContext';

// Model
import { EditModalInterface } from '../../../Model/ModelForModal';

// Data (CSS Syntax)
import { BookImageFormat, DeleteButton, displayAsColumn, displayAsRow, ModalBodySyntax } from '../../../Data/Style';
import { useDefinitionContext } from '../../../Context/Book/DefinitionContext';
import { BookDataInterfaceForEdit, ContactInterface, DefinitionInterface } from '../../../Model/ResultModel';
import { BookTableDataInterface } from '../../../Model/BookTableModel';
import { useContactContext } from '../../../Context/Book/ContactContext';
import { DataValidateField } from '../../../Controller/ValidateController';
import { TransferDateToISOString } from '../../../Controller/OtherController';

const EditBookModal:FC<EditModalInterface> = (editModalData) => 
{
    const { definition } = useDefinitionContext();
    const { contact } = useContactContext();
    const { handleOpen } = useModal();

    const { value, editData, compareData } = editModalData;
    const EditData = editData as BookDataInterfaceForEdit;
    const CompareData = compareData as BookDataInterfaceForEdit;

    // For UI Rendering
    const EditBookInputField = useMemo(() => 
    [
        {name: "bookname", label: "Book Name", type:"text", select: false, slotProps: {}, multiline: false, rows: 1 },
        {name: "language", label: "Language", type:"text", select: true, options: definition.Language, slotProps: {}, multiline: false, rows: 1},
        {name: "genre", label: "Genre", type:"text", select: true, options: definition.Genre, slotProps:{}, multiline: false, rows: 1},
        {name: "author", label: "Author", type:"text", select: true, options: contact.Author, slotProps:{}, multiline: false, rows: 1},
        {name: "publisher", label: "Publisher", type:"text", select: true, options: contact.Publisher, slotProps:{}, multiline: false, rows: 1},
        {name: "publishDate", label: "Publish Date", type: "date", select: false, slotProps:{}, multiline: false, rows: 1},
        {name: "description", label: "Description", type: "text", select:false, slotProps:{}, multiline: true, rows: 8}
    ],[definition, contact.Author, contact.Publisher])
    
    const [book, setBook] = useState(
        {   
            _id: EditData._id, bookname: EditData.bookname, language: EditData.language as string,  
            genre: EditData.genre, author: EditData.author, publisher: EditData.publisher,  publishDate: TransferDateToISOString(EditData.publishDate as string), 
            description: EditData.description, filename: EditData.filename, imageUrl: EditData.imageUrl, image: EditData.image
        }
    );

    const CompareBook = 
    { 
        _id: CompareData._id, bookname: CompareData.bookname, language: CompareData.language as string,
        genre: CompareData.genre, author: CompareData.author, publisher: CompareData.publisher, publishDate: TransferDateToISOString(CompareData.publishDate as string),
        description: CompareData.description, filename: CompareData.filename, imageUrl: CompareData.imageUrl 
    };

    // For data validate
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({bookname: "", author: "", genre: "", publisher: "", publishDate: "", description: ""});
    const [helperTexts, setHelperText] = useState({bookname: "", author: "", genre: "", publisher: "",  publishDate: "", description: ""});

    // For Iamge input
    const [imageFile, setImageFile] = useState<File | null>(book.image || null); 
    const [previewUrl, setPreviewUrl] = useState<string | null>(book.imageUrl || null);

    const onSelectChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setBook({ ...book, [name]: value });
    }
    
    const fetchImage = useCallback(async (imageURL: string) => 
    {
        try 
        {
            const response = await fetch(imageURL);
    
            if (!response.ok) 
            {
                throw new Error("Failed to fetch image");
            }
    
            const blob = await response.blob(); 
            const file = new File([blob], CompareData.filename as string, { type: blob.type });
    
            setImageFile(file);
            const preview = URL.createObjectURL(blob);
            setPreviewUrl(preview);
        } 
        catch (error) 
        {
            console.error("Error fetching image:", error);
        }
    },[CompareData.filename])

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const target = event.target;
        const file = target.files?.[0];
        if (file) 
        {
            setImageFile(file);
            book.filename = file.name;

            const newFile = URL.createObjectURL(file);
            setPreviewUrl(newFile);
            book.imageUrl = newFile;
        }
        target.value = ""; 
    };

    const removeImage = () => 
    {
        if (previewUrl) 
        {
            URL.revokeObjectURL(previewUrl); 
            setPreviewUrl(null);
            book.imageUrl = "";

            setImageFile(null);
            book.filename = "";
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
            const ignoreList = ["description", "publishDate", "image", "imageUrl", "filename", "_id"];
            if(ignoreList.includes(field))
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
            handleOpen(<EditBookConfirmModal editData={{...book, image: imageFile, imageURL: previewUrl}} compareData={CompareBook} value={value}/>) 
        }
    }

    useEffect(() => 
    {
        fetchImage(CompareData.imageUrl);
    }, [EditData.imageUrl, CompareData.imageUrl, CompareData.filename, fetchImage]);

    return (
        <ModalTemplate title={"Edit Book Record"} minWidth="500px" maxWidth="750px" width="100%" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Box sx={{...displayAsRow, marginBottom: '10px !important'}}>
                    <Box sx={{...displayAsColumn, justifyContent: 'center', alignItems: 'center', width: '40%'}}>
                        {previewUrl  ?
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
                            book.imageUrl && 
                            (
                                <Button variant="contained" sx={{ backgroundColor:DeleteButton.backgroundColor, width: '100%', marginTop: '10px' }} onClick={removeImage}>Remove Image</Button>
                            )
                        }
                    </Box>

                    <Box sx={{...displayAsColumn, marginLeft: '20px', gap: '20px 100px', width: '60%'}}>
                    {
                        EditBookInputField.map((field, index) => 
                        (
                            <TextField key={index} label={field.label} name={field.name} value={book[field.name as keyof BookTableDataInterface]} 
                                type={field.type} size="small" select={field.select} slotProps={field.slotProps} multiline={field.multiline} rows={field.rows}
                                helperText={isSubmitted && helperTexts[field.name as keyof typeof helperTexts]}
                                error={isSubmitted && errors[field.name as keyof typeof errors] !== ""}
                                onChange={onSelectChange}
                            >
                                    {
                                        field.options && field.options.map((option, index) => 
                                            {
                                                const definitionOption = option as DefinitionInterface;
                                                const contactOption = option as ContactInterface;

                                                const fieldMap: Record<string, string | undefined> = 
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
            <Button variant='contained' onClick={HandleDataValidate}>Edit</Button>
        </ModalTemplate>
    );
}

export default EditBookModal;