import { useState, ChangeEvent, FC, useMemo } from "react";
import { TransferDateToISOString } from "../../../../Controller/OtherController";
import { BookDataInterfaceForEdit, ContactInterface, DefinitionInterface } from "../../../../Model/ResultModel";
import { IEditBookData } from "../EditBookModal";
import { Box, TextField, MenuItem } from "@mui/material";
import { displayAsColumn, optionFieldSlotProps } from "../../../../Data/Style";
import { BookTableDataInterface } from "../../../../Model/BookTableModel";
import { useContactContext } from "../../../../Context/Book/ContactContext";
import { useDefinitionContext } from "../../../../Context/Book/DefinitionContext";

export const useDataHandler = (editData: IEditBookData, compareData: IEditBookData) => 
{
    const EditData = editData as BookDataInterfaceForEdit;
    const CompareData = compareData as BookDataInterfaceForEdit;

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


    const onDataChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setBook({ ...book, [name]: value });
    }

    return {book, EditData, CompareData, CompareBook, onDataChange};
}

interface BookEditDataSectionProps
{
    book: any;
    isSubmitted: boolean;
    helperTexts: Record<string, any>;
    errors:Record<string, any>;
    onDataChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const useBookEditModalLayout = () => 
{
    const { definition } = useDefinitionContext();
    const { contact } = useContactContext();

    // For UI Rendering
    const EditBookInputField = useMemo(() => 
    [
        {name: "bookname", label: "Book Name", type:"text", select: false, slotProps: {}, multiline: false, rows: 1 },
        {name: "genre", label: "Genre", type:"text", select: true, options: definition[0], slotProps: optionFieldSlotProps, multiline: false, rows: 1},
        {name: "language", label: "Language", type:"text", select: true, options: definition[1], slotProps: optionFieldSlotProps, multiline: false, rows: 1},
        {name: "author", label: "Author", type:"text", select: true, options: contact[0], slotProps: optionFieldSlotProps, multiline: false, rows: 1},
        {name: "publisher", label: "Publisher", type:"text", select: true, options: contact[1], slotProps: optionFieldSlotProps, multiline: false, rows: 1},
        {name: "publishDate", label: "Publish Date", type: "date", select: false, slotProps:{}, multiline: false, rows: 1},
        {name: "description", label: "Description", type: "text", select:false, slotProps:{}, multiline: true, rows: 8}
    ],[definition, contact])

    return { EditBookInputField };
}

const BookEditDataSection:FC<BookEditDataSectionProps> = (props) => 
{
    const { book, isSubmitted, helperTexts, errors, onDataChange} = props;

    const { EditBookInputField } = useBookEditModalLayout();

    return(
        <Box sx={{...displayAsColumn, marginLeft: '20px', gap: '20px 100px', width: '60%'}}>
        {
            EditBookInputField.map((field, index) => 
            (
                <TextField key={index} label={field.label} name={field.name} value={book[field.name as keyof BookTableDataInterface]} 
                    type={field.type} size="small" select={field.select} slotProps={field.slotProps} multiline={field.multiline} rows={field.rows}
                    helperText={isSubmitted && helperTexts[field.name as keyof typeof helperTexts]}
                    error={isSubmitted && errors[field.name as keyof typeof errors] !== ""}
                    onChange={onDataChange}
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
    )
}

export default BookEditDataSection