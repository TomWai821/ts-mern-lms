import path from 'path';
import fs from 'fs/promises';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { BUCKET_NAME, AWS_REGION, s3Client } from '../../init/connectToS3';
import { config } from '../../config/config';

export const ImageDataBuilder = async (file: Express.Multer.File, publishDate: string) => 
{
    const imageName = file ? `${Date.now()}-${file.originalname}` : null;
    const mongoDate = new Date(publishDate);
    let imageUrl = null;

    if(imageName)
    {
        switch (config.STORAGE_TYPE)
        {
            case 'S3':
                imageUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/upload/${imageName}`;
                break;

            case 'LOCAL':
                imageUrl = `${config.BACKEND_BASE_URL}/upload/${imageName}`;
                break;
        }
    }

    return { image: {url:imageUrl, filename:imageName}, publishDate:mongoDate };
}

export const UploadImage = async (file: Express.Multer.File, imageName: string) =>
{
    if(file && imageName)
    {
        switch (config.STORAGE_TYPE)
        {
            case 'S3':
                await uploadImageToS3(file, imageName);
                break;

            case 'LOCAL':
                await uploadImageLocally(file, imageName);
                break;
        }
    }
}

const uploadImageLocally = async (file: Express.Multer.File, imageName: string) =>
{
    const uploadPath = path.join(__dirname, '../upload', imageName);
    await fs.writeFile(uploadPath, file.buffer);
}

const uploadImageToS3 = async (file: Express.Multer.File, imageName: string) => 
{
    const command = new PutObjectCommand(
        {
            Bucket: BUCKET_NAME as string,
            Key: `upload/${imageName}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }
    );

    await s3Client.send(command);
}