import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { BookDataInterfaceForEdit } from "../../../../Model/ResultModel";
import { IEditBookData } from "../EditBookModal";
import { Box, Avatar, Typography, Button } from "@mui/material";
import { displayAsColumn, BookImageFormat, DeleteButton } from "../../../../Data/Style";

export const useImageHandler = (book: IEditBookData, EditData: BookDataInterfaceForEdit, CompareData: BookDataInterfaceForEdit) => 
{
    // For Iamge input
    const [imageFile, setImageFile] = useState<File | null>(book.image || null); 
    const [previewUrl, setPreviewUrl] = useState<string | null>(book.imageUrl || null);

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

    useEffect(() => 
    {
        fetchImage(CompareData.imageUrl);
    }, [EditData.imageUrl, CompareData.imageUrl, CompareData.filename, fetchImage]);

    return { imageFile, previewUrl, handleFileChange, removeImage }
}

interface BookEditImageSectionProps
{
    book: any;
    previewUrl: string | null;
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    removeImage: () => void;
}

const BookEditImageSection:FC<BookEditImageSectionProps> = (props) => 
{
    const {book, previewUrl, handleFileChange, removeImage} = props;

    return(
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
    )
}

export default BookEditImageSection