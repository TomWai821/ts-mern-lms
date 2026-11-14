import { useSelfBookRecordContext } from "../../Context/Book/SelfBookRecordContext";
import { GetResultInterface } from "../../Model/ResultModel";
import { favouriteBook, noLongerFavouriteBook } from "../../services/contents/selfRecordService";
import { useMutation } from "../customhook/useMutation";

export const useFavouriteBookAction = () => 
{
    const { refreshSelfRecords } = useSelfBookRecordContext();
    const { MutationFeedback } = useMutation();

    const FavouriteBook = async (bookDataID:string) => 
    {
        const response = await favouriteBook(bookDataID);
        const result: GetResultInterface = await response.json();

        await MutationFeedback(response, result);

        if (response.ok) 
        {
            await refreshSelfRecords("FavouriteBook");
        }
    }

    const NoLongerFavouriteBook = async (favouriteBookID: string) => 
    {
        const response = await noLongerFavouriteBook(favouriteBookID)
        const result: GetResultInterface = await response.json();

        await MutationFeedback(response, result);
        
        if (response.ok) 
        {
            await refreshSelfRecords("FavouriteBook");
        }
    }

    return {FavouriteBook, NoLongerFavouriteBook};
}
