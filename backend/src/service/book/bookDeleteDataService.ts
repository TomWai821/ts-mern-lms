import { FindBookFavouriteAndDeleteMany } from "../../schema/book/bookFavourite";
import { FindBookLoaned, FindBookLoanedAndDelete, FindBookLoanedByID } from "../../schema/book/bookLoaned";
import { BookInterface, BookLoanedInterface } from "../../model/bookSchemaInterface";
import { FindBookByID, FindBookByIDAndDelete } from "../../schema/book/book";
import { HandleDeleteImage } from "../image/bookDeleteImageService";
import { BookEvent, broadcast } from "../../ws";

interface ServiceResponse 
{
    success: boolean;
    statusCode: number;
    error?: string;
    message?: string;
}

export const BookDeletionService = async (bookID: string): Promise<ServiceResponse> => 
{
    // 1. Ensure the book exists (Before attempting deletion)
    const bookRecord = await FindBookByID(bookID) as BookInterface;

    if (!bookRecord)
    {
        return { success: false, statusCode: 404, error: "Book not found" };
    }
    
    // 2. Delete the book record
    const deletedBook = await FindBookByIDAndDelete(bookID);

    if (!deletedBook)
    {
        return { success: false, statusCode: 500, error: "Failed to delete book master record" };
    }

    // 3. Fire-and-forget background cleanup: do not await to avoid blocking primary delete
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    void ExecuteBackgroundCleanup(bookID, bookRecord.image.filename);

    broadcast(BookEvent.BOOK_DELETE, bookID);
    broadcast(BookEvent.LOAN_BOOK_DELETE, bookID);

    // 4. Return success response (If main deletion succeeded)
    return { success: true, statusCode: 200, message: "Delete Book Record Successfully"};
}

/**
 * Non‑blocking background cleanup for book deletion
 *
 * Design intent:
 * - Run shadow DB cleanup and asset (image) deletion as fire‑and‑forget tasks 
 *   so the primary book record deletion is never blocked by side‑effect failures.
 * 
 * - Use Promise.allSettled for parallel DB cleanup and catch image deletion errors
 *   to contain side‑effect failures and guarantee primary record persistence.
 * 
 * - Emit structured logs (warnings/errors) to aid post‑mortem analysis and future metrics
 *
 * 
 * Note: 
 * - This function intentionally returns void to the caller, as it's designed for non‑blocking execution
 * 
 *
 * @param bookID - Identifier of the deleted book
 * @param filename - Associated image filename to remove from storage
 * @returns void
 * 
 */
const ExecuteBackgroundCleanup = (bookID: string, filename: string): void => 
{
    // 1. Delete related records in parallel (Loaned and Favourite)
    Promise.allSettled([FindBookLoanedAndDelete({ bookID }), FindBookFavouriteAndDeleteMany({ bookID })])
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
