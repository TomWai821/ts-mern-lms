import { Box, Typography, Button, Avatar } from '@mui/material';
import { ChangeEvent, FC, useState } from 'react';
import { BookImageFormat, DeleteButton, displayAsColumn } from '../../../../Data/Style';
import { CreateBookModalInterface } from '../../../../Model/ModelForModal';

interface BookImageSectionProps 
{
    previewUrl: string | null;
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
}

export const useImageHandler = (bookImageData?: CreateBookModalInterface["imageData"]) => 
{
    const [imageFile, setImageFile] = useState<File | null>((bookImageData?.image as File) || null);
    const [previewUrl, setPreviewUrl] = useState<string | null>((bookImageData?.imageURL as string) || null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const file = event.target.files?.[0];

        if (file) 
        {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
        event.target.value = '';
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

    const requestData = {image: imageFile};

    return {previewUrl, handleFileChange, removeImage, requestData};
}

const BookImageSection: FC<BookImageSectionProps> = (props) => 
{
    const { previewUrl, onFileChange, onRemoveImage } = props;

    return(
        <Box sx={{ ...displayAsColumn, justifyContent: 'center', alignItems: 'center', width: '40%' }}>
            {
                previewUrl ? 
                (
                    <Avatar src={previewUrl} alt="Preview" variant="rounded" sx={BookImageFormat} />
                )
                : 
                (
                    <Typography color="text.secondary">No Image Uploaded</Typography>
                )
            }

            <Button variant="contained" component="label" sx={{ width: '100%', marginTop: '10px' }}>
                Upload Image
                <input hidden type="file" accept="image/*" onChange={onFileChange} />
            </Button>

            {
                previewUrl && 
                (
                    <Button variant="contained" sx={{ backgroundColor: DeleteButton.backgroundColor, width: '100%', marginTop: '10px' }} onClick={onRemoveImage}>
                        Remove Image
                    </Button>
                )
            }
        </Box>
    )
};

export default BookImageSection;