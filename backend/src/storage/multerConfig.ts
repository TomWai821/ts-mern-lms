import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'path';

export const deleteImage = async (imageName: string): Promise<void> => 
{
    try
    {
        const imagePath = path.join(path.resolve(process.cwd(), "src/upload"), imageName);
        await fs.unlink(imagePath); 
    } 
    catch (err) 
    {
        if ((err as any).code === 'ENOENT') 
        {
            console.warn(`Image not found: ${imageName} (Skipping deletion)`);
        } 
        else 
        {
            console.error(`Error deleting image: ${imageName}`, err);
            throw new Error(`Failed to delete image: ${imageName}`);
        }
    }
};

export const upload = multer({storage: multer.memoryStorage()})
