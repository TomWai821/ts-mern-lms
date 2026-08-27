import { ChangeEvent, FC, useState } from 'react';
import { Box, Button } from '@mui/material';

import ModalTemplate from '../../Templates/ModalTemplate';
import CreateBookConfirmModal from '../Confirmation/Book/CreateBookConfirmModal';
import { CreateBookModalInterface } from '../../../Model/ModelForModal';
import { displayAsRow, ModalBodySyntax } from '../../../Data/Style';
import { GetCurrentDate } from '../../../Controller/OtherController';

import BookImageSection, { useImageHandler } from './BookCreationModalSections/BookImageSection';
import { BookDataSection } from './BookCreationModalSections/BookDataSection';
import { useDataValidation } from '../../../customhook/DataValidation';

const validationList = { bookname: '', language: '', genre: '', author: '', publisher: '', publishDate: '', description: '' };
const ignoreList = ['publishDate', 'description'];

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
    const { book, onDataChange } = useCreateBookData(bookData["book"]);
    const { previewUrl, handleFileChange, removeImage, imageData } = useImageHandler(bookData["imageData"]);
    const { isSubmitted, errors, helperTexts, handleDataValidate } = useDataValidation<CreateBookModalInterface["book"]>(
        book, validationList,ignoreList,
        <CreateBookConfirmModal data={{book, imageData}} />
    );

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