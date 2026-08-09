import { BookEvent, broadcast } from "../../ws";
import { FindBookByIDAndUpdate, GetBook } from "../../schema/book/book";
import { UploadImage } from "../image/bookCreateImageService";
import { HandleDeleteImage } from "../image/bookDeleteImageService";
import { EditImageInterface } from "../../model/requestInterface";
import { BookInterface, BookLoanedInterface } from "../../model/bookSchemaInterface";
import { GetBookLoaned } from "../../schema/book/bookLoaned";

export const BookUpdateDataService = async (bookID: string, editBookData: BookInterface, editImageData: EditImageInterface, fileData: Express.Request["file"]) => 
{
    const { bookname, languageID, genreID, authorID, publisherID, description, publishDate } = editBookData;

    const updateData: Record<string, any> = { bookname, languageID, genreID, authorID, publisherID, description, publishDate: new Date(publishDate) };
    
    const updateBookRecord = await FindBookByIDAndUpdate(bookID, {$set: {image: { url: editImageData.newImageUrl, filename: editImageData.newImageName }, ...updateData }});
    
    if (!updateBookRecord)
    {
        return {success: false, statusCode: 400, error: "Failed to Update Book Data"}
    }

    if (editImageData.isImageChanged && fileData) 
    {
        await UploadImage(fileData as Express.Multer.File, editImageData.newImageName);
    
        if (editImageData.oldImageName) 
        {
            await HandleDeleteImage(editImageData.oldImageName);
        }
    }

    const editBookRecord = await GetBook({ _id: updateBookRecord._id }) as unknown as BookInterface[];

    const loanBookRecord = await GetBookLoaned({bookID: updateBookRecord._id}) as unknown as BookLoanedInterface[];
    
    broadcast(BookEvent.BOOK_UPDATE, editBookRecord[0]);
    broadcast(BookEvent.LOAN_BOOK_UPDATE, loanBookRecord[0]);
    return {success: true, statusCode: 200, message: "Book Record Updated Successfully!"}
}
