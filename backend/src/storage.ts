import { Request } from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'path';

type MulterFile = Express.Multer.File;

const storage = multer.diskStorage(
    {
        destination: (req:Request, file:MulterFile, callback:(_error: Error | null, destination: string) => void) => 
        {
            callback(null, path.join(__dirname, 'upload'));
        },
        filename: (req:Request, file:MulterFile, callback:(_error: Error | null, filename: string) => void) => 
        {
            callback(null, `${Date.now()}-${file.originalname}`);
        }
    }
)

export const deleteImage = async (imageName: string): Promise<void> => 
{
    try 
    {
        const imagePath = path.join(__dirname, 'upload', imageName);
        await fs.unlink(imagePath); 
    } 
    catch (err) 
    {
        if ((err as any).code === 'ENOENT') 
        {
            console.warn(`Image not found: ${imageName}. Skipping deletion.`);
        } 
        else 
        {
            console.error(`Error deleting image: ${imageName}`, err);
            throw new Error(`Failed to delete image: ${imageName}`);
        }
    }
};
export const upload = multer({storage})
