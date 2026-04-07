import { Response } from 'express';
import { FindBookByID } from "../../schema/book/book";
import { BookInterface } from '../../model/bookSchemaInterface';
import { AuthRequest } from '../../model/requestInterface';
import { config } from '../../config/config';
import { BUCKET_NAME, AWS_REGION } from '../../init/connectToS3';

export const HandleEditImage = async (req: AuthRequest, res: Response, next: Function) => 
{
    try
    {
        const bookID = req.params.id;
        const {imageName} = req.body;

        const bookData = await FindBookByID(bookID as string) as BookInterface;

        if(!bookData)
        {
            return res.status(404).json({success: false, error: "Book Record not found!"})
        }

        const oldImageName = bookData.image.filename;
        let newImageName = oldImageName;
        let newImageUrl = bookData.image.url;
        const isImageChanged = (imageName?.trim() !== oldImageName) || !!req.file;
        
        if (isImageChanged && req.file) 
        {
            const rawName = req.file.originalname;
            const cleanFileName = rawName.replace(/^\d+-/, '');

            newImageName = `${Date.now()}-${cleanFileName}`;
            
            switch (process.env.STORAGE_TYPE)
            {
                case 's3':
                    newImageUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}://${newImageName}`;
                    break;

                case 'LOCAL':
                    newImageUrl = `${config.BACKEND_BASE_URL}/upload/${newImageName}`;
                    break;
            }
        }

        req.editImageData = {isImageChanged, newImageName, newImageUrl, oldImageName};
        next();
    }
    catch(error)
    {
        console.error('HandleEditImage Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error!' });
    }
} 
