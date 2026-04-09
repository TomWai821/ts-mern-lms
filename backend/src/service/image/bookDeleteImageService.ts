import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, s3Client } from "../../init/connectToS3";
import { deleteImage } from "../../storage/multerConfig";

export const HandleDeleteImage = async (oldImageName: string) =>
{   
    switch (process.env.STORAGE_TYPE)
    {
        case 'S3':
            await DeleteImageFromS3(oldImageName);
            break;

        case 'LOCAL':
            await DeleteImageLocally(oldImageName);
            break;
    }
}

const DeleteImageLocally = async (oldImageName: string) =>
{
    await deleteImage(oldImageName);   
}

const DeleteImageFromS3 = async (oldImageName: string) => 
{
    const deleteCommand = new DeleteObjectCommand(
        {
            Bucket: BUCKET_NAME,
            Key: `upload/${oldImageName}`,
        }
    );
    await s3Client.send(deleteCommand);
}