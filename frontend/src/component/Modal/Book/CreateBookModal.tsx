import { ChangeEvent, FC, useState } from 'react';
import { Box, Button } from '@mui/material';

import ModalTemplate from '../../Templates/ModalTemplate';
import CreateBookConfirmModal from '../Confirmation/Book/CreateBookConfirmModal';
import { useModal } from '../../../Context/ModalContext';
import { CreateBookModalInterface } from '../../../Model/ModelForModal';
import { displayAsRow, ModalBodySyntax } from '../../../Data/Style';
import { GetCurrentDate } from '../../../Controller/OtherController';
import { DataValidateField } from '../../../Controller/ValidateController';
import { BookTableDataInterface } from '../../../Model/BookTableModel';

import BookImageSection, { useImageHandler } from './BookCreationModalSections/BookImageSection';
import { BookDataSection } from './BookCreationModalSections/BookDataSection';

const useDataValidation = (book: Record<string, any>, imageData: Record<string, any>) => 
{
    const { handleOpen } = useModal();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({ bookname: '', author: '', genre: '', publisher: '', publishDate: '', description: '' });
    const [helperTexts, setHelperText] = useState({ bookname: '', author: '', genre: '', publisher: '', publishDate: '', description: '' });

    const handleDataValidate = async () => 
    {
        let validationPassed = true;
        const newErrors = { ...errors };
        const newHelperTexts = { ...helperTexts };
        setIsSubmitted(true);

        Object.keys(book).forEach((field) => 
        {
            if (['publishDate', 'description'].includes(field)) return;

            const { helperText, error, success } = DataValidateField(field, book[field as keyof BookTableDataInterface]) || {};
            newHelperTexts[field as keyof typeof newHelperTexts] = helperText;
            newErrors[field as keyof typeof newErrors] = error;

            if (!success) validationPassed = false;
        });

        setHelperText(newHelperTexts);
        setErrors(newErrors);

        if (validationPassed) 
        {
            handleOpen(<CreateBookConfirmModal data={{ ...book, image: imageData.imageFile, imageURL: imageData.previewUrl }} />);
        }
    };

    return { isSubmitted, errors, helperTexts, handleDataValidate };
};

const useCreateBookData = (bookData?: CreateBookModalInterface["book"]) => 
{
    const [book, setBook] = useState({ 
        bookname: bookData?.bookname || '', language:  bookData?.language || '',
        genre:  bookData?.genre || '', author:  bookData?.author || '', publisher:  bookData?.publisher || '', 
        description:  bookData?.description || '', publishDate:  bookData?.publishDate || (GetCurrentDate('String') as string), 
    });

    const onDataChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { name, value } = event.target;
        setBook((prev) => ({ ...prev, [name]: value }));
    };

    return {book, onDataChange};
}

const CreateBookModal: FC<CreateBookModalInterface> = ({ ...bookData }) => 
{
    const { book, onDataChange,  } = useCreateBookData(bookData["book"]);
    const { previewUrl, handleFileChange, removeImage, requestData } = useImageHandler(bookData["imageData"]);
    const { isSubmitted, errors, helperTexts, handleDataValidate } = useDataValidation(book, requestData);

    return (
        <ModalTemplate title="Create Book Record" minWidth="500px" maxWidth="750px" width="100%" cancelButtonName="Exit">
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Box sx={{ ...displayAsRow, marginBottom: '10px' }}>
                    <BookImageSection previewUrl={previewUrl} onFileChange={handleFileChange} onRemoveImage={removeImage} />
                    <BookDataSection book={book} isSubmitted={isSubmitted} errors={errors} helperTexts={helperTexts} onChange={onDataChange}/>
                </Box>
            </Box>

            <Button variant="contained" onClick={handleDataValidate}>
                Create
            </Button>
        </ModalTemplate>
    );
};

export default CreateBookModal;