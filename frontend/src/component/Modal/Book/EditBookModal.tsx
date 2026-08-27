import {  FC } from 'react'
import { Box, Button,  } from '@mui/material';

// Template
import ModalTemplate from '../../Templates/ModalTemplate';

// Another Modal
import EditBookConfirmModal from '../Confirmation/Book/EditBookConfirmModal';

// Model
import { EditModalInterface } from '../../../Model/ModelForModal';

// Data (CSS Syntax)
import { displayAsRow, ModalBodySyntax } from '../../../Data/Style';
import { useDataValidation } from '../../../customhook/DataValidation';
import BookEditImageSection, { useImageHandler } from './BookEditModalSections/BookEditImageSection';
import BookEditDataSection, { useDataHandler } from './BookEditModalSections/BookEditDataSection';

export interface IEditBookData
{
    _id: string;
    bookname: string;
    language: string;
    genre: string | undefined;
    author: string | undefined;
    publisher: string | undefined;
    publishDate: string;
    description: string;
    filename: string;
    imageUrl: string;
    image: File | undefined;
}

const ignoreList = ["description", "publishDate", "image", "imageUrl", "filename", "_id"];
const validationList = {bookname: "", author: "", genre: "", publisher: "", publishDate: "", description: ""};


const EditBookModal:FC<EditModalInterface> = (editModalData) => 
{
    const { value, editData, compareData } = editModalData;
    const { book, EditData, CompareData, CompareBook, onDataChange } = useDataHandler(editData, compareData);
    const { imageFile, previewUrl, handleFileChange, removeImage } = useImageHandler(book, EditData, CompareData);
   
    const { isSubmitted, errors, helperTexts, handleDataValidate } = useDataValidation<IEditBookData>(
        book, validationList, ignoreList,
        <EditBookConfirmModal editData={{...book, image: imageFile, imageURL: previewUrl}} compareData={CompareBook} value={value}/>
    );

    return (
        <ModalTemplate title={"Edit Book Record"} minWidth="500px" maxWidth="750px" width="100%" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Box sx={{...displayAsRow, marginBottom: '10px !important'}}>
                    <BookEditImageSection book={book} previewUrl={previewUrl} handleFileChange={handleFileChange} removeImage={removeImage}/>

                    <BookEditDataSection book={book} isSubmitted={isSubmitted} helperTexts={helperTexts} errors={errors} onDataChange={onDataChange}/>
                </Box>
            </Box>
            <Button variant='contained' onClick={handleDataValidate}>Edit</Button>
        </ModalTemplate>
    );
}

export default EditBookModal;