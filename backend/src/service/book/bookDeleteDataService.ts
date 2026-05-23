import { FindBookFavouriteAndDeleteMany } from "../../schema/book/bookFavourite";
import { FindBookLoanedAndDelete } from "../../schema/book/bookLoaned";
import { BookInterface } from "../../model/bookSchemaInterface";
import { FindBookByID, FindBookByIDAndDelete } from "../../schema/book/book";
import { HandleDeleteImage } from "../image/bookDeleteImageService";

interface ServiceResponse 
{
    success: boolean;
    status: number;
    error?: string;
}

export const BookDeletionService = async (bookID: string): Promise<ServiceResponse> => 
{
    // 1. Ensure the book exists (Before attempting deletion)
    const bookRecord = await FindBookByID(bookID) as BookInterface;

    if (!bookRecord)
    {
        return { success: false, status: 404, error: "Book not found" };
    }
    
    // 2. Delete the book record
    const deletedBook = await FindBookByIDAndDelete(bookID);

    if (!deletedBook)
    {
        return { success: false, status: 500, error: "Failed to delete book master record" };
    }

    // 3. Execute background cleanup for related records and image deletion (Non-blocking)
    ExecuteBackgroundCleanup(bookID, bookRecord.image.filename);

    // 4. Return success response (If main deletion succeeded)
    return { success: true, status: 200 };
}


const ExecuteBackgroundCleanup = (bookID: string, filename: string): void => 
{
    // 1. Delete related records in parallel (Loaned and Favourite)
    Promise.allSettled([FindBookLoanedAndDelete({ bookID }),FindBookFavouriteAndDeleteMany({ bookID })])
        .then(([loanResult, favouriteResult]) => 
        {
            // Log any failures in related record cleanup (But do not affect the main response)
            if (loanResult.status === 'rejected' || favouriteResult.status === 'rejected')
            {
                console.warn(`Book ${bookID} database shadow cleanup incomplete:`,
                {
                    loanError: loanResult.status === 'rejected' ? loanResult.reason : null,
                    favouriteError: favouriteResult.status === 'rejected' ? favouriteResult.reason : null
                });
            }
        });

    // 2. Delete the associated image (Non-blocking)
    HandleDeleteImage(filename)
        .catch(storageError => 
        {
            console.error(`[${process.env.STORAGE_TYPE}] Storage Image deletion failed for book ${bookID}:`, storageError);
        });
}
