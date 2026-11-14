import path from 'path';
import { Response } from 'express';

import { IStorageStrategy } from "./StorageFactory";
import { BUCKET_NAME, AWS_REGION } from '../init/connectToS3';

export class S3Strategy implements IStorageStrategy 
{
    getReadUrl(imageName: string) 
    {
        return `https://${BUCKET_NAME}.s3.${AWS_REGION}://${imageName}`;
    }

    handleResponse(imageName: string, res: Response) 
    {
        res.redirect(this.getReadUrl(imageName));
    }
}

export class LocalStrategy implements IStorageStrategy 
{
    getReadUrl(imageName: string): string | Promise<string> | null
    {
        console.log("LocalStrategy getReadUrl called for file:", imageName);
        return null; // Local strategy does not use a URL for reading
    }

    handleResponse(imageName: string, res: Response) 
    {
        const filePath = path.resolve(__dirname, '../upload', path.basename(imageName));
        res.sendFile(filePath);
    }
}