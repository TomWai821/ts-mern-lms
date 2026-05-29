import { CreateBook, FindBookByIDAndDelete } from "../../schema/book/book";
import { ImageDataBuilder, UploadImage } from "../image/bookCreateImageService";

interface BookDataInterface
{
    bookname: string; 
    languageID: string;
    genreID: string;
    authorID: string;
    publisherID: string;
    description: string;
    publishDate: string;
}

// services/bookService.ts
export const CreateBookRecordService = async (bookData: BookDataInterface, file?: Express.Multer.File) => 
{
    let createdBookId: string | undefined;

    try 
    {
        let imageData;

        if(file)
        {
            // 1. Create image metadata
            imageData = await ImageDataBuilder(file, bookData.publishDate);
        }

        // 2. Create book record
        const createBook = await CreateBook({ ...bookData, publishDate: imageData?.publishDate, image: { url: imageData?.image.url, filename: imageData?.image.filename}});

        if (!createBook) 
        {
            throw new Error("Failed to create book record");
        }

        createdBookId = createBook._id.toString();

        // 3. Upload image (asynchronous side effect)
        if (file && imageData?.image.filename) 
        {
            await UploadImage(file, imageData.image.filename);
        }

        return { success: true, bookId: createdBookId };
    } 
    catch (error) 
    {
        // rollback
        if (createdBookId) 
        {
            await FindBookByIDAndDelete(createdBookId);
            console.warn(`Rollback: deleted book ${createdBookId} due to image upload failure`);
        }

        throw error;
    }
};
