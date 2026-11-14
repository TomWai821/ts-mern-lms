import { FC } from "react";
import { IconButton, TableCell, Tooltip } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, EventAvailable as EventAvailableIcon, Search as SearchIcon, StarBorder as StarBorderIcon, Star as StarIcon } from "@mui/icons-material";

import { ImportantActionButtonSyntax } from "../../../../Data/Style";
import { BookSearchInterface } from "../../../../Model/BookTableModel";
import { ActionTableCellInterface } from "../../../../Model/TablePagesAndModalModel";
import { BookDataInterface, LoanBookInterface } from "../../../../Model/ResultModel";
import { useModal } from "../../../../Context/ModalContext";
import { StatusDetection } from "../../../../Controller/OtherUsefulController";
import { useSelfBookRecordContext } from "../../../../Context/Book/SelfBookRecordContext";

import EditBookModal from "../modals/actions/EditBookModal";
import DeleteBookModal from "../modals/confirms/DeleteBookConfirmModal";
import LoanBookConfirmationModal from "../modals/confirms/LoanBookConfirmationModal";

import { fetchSelfLoanBookWithFilter } from "../../../../services/contents/selfRecordService";
import { useBookContext } from "../../../../Context/Book/BookContext";
import { useFavouriteBookAction } from "../../../../hooks/actionhook/useBookFavouriteAction";

export const useFavouriteBookHandler = (bookData: BookDataInterface) => 
{
    const { BookRecordForUser } = useSelfBookRecordContext();
    const { FavouriteBook, NoLongerFavouriteBook } = useFavouriteBookAction();

    const favouriteRecord = BookRecordForUser[1].find(favouriteBook => favouriteBook.bookDetails?._id === bookData._id);
    const isFavourite = Boolean(favouriteRecord);

    const favouriteIconConfig = isFavourite ? 
    {
        syntax: { "&:hover": { backgroundColor: "lightGray" }, color: "gold" },
        icon: <StarIcon />,
        toolTip: "No Longer favourite"
    } 
    : 
    {
        syntax: { "&:hover": { backgroundColor: "lightGray" } },
        icon: <StarBorderIcon />,
        toolTip: "Favourite"
    } 

    const favouriteHandler = async () =>
    {
        if (favouriteRecord) 
        {
            await NoLongerFavouriteBook(favouriteRecord._id);
            return;
        }

        await FavouriteBook(bookData._id);
    };

    return {favouriteIconConfig, favouriteHandler};
}

const LoanBookHandler = 
(
    bookData: BookDataInterface, changeValue: ActionTableCellInterface["changeValue"], 
    setSearchBook: ActionTableCellInterface["setSearchBook"], searchBook: ActionTableCellInterface["searchBook"]
) => 
{
    const { modifyBooks } = useBookContext();
    const { handleOpen } = useModal();

    const viewLoanBookRecord = async () =>
    {
        if (changeValue && setSearchBook)
        {
            const searchLoanBookResult = await fetchSelfLoanBookWithFilter("AllUser", bookData.bookname) as LoanBookInterface[];
            modifyBooks({type: "SET_LOAN_BOOK", payload: searchLoanBookResult});
            changeValue("Tab", 1);

            const currentSearchBook = searchBook ?? ({} as BookSearchInterface);
            setSearchBook({ ...currentSearchBook, bookname: bookData.bookname });
        }
    };

    const openLoanBookModal = () =>
    {
        handleOpen(<LoanBookConfirmationModal tabValue={0} _id={bookData._id} bookname={bookData.bookname} author={bookData.authorDetails.author as string}
            language={bookData.languageDetails.language as string} genre={bookData.genreDetails.genre as string} description={bookData.description as string}
            imageUrl={bookData.image?.url as string} />);
    };

    return {viewLoanBookRecord, openLoanBookModal};
}

const BookDataHandler = (bookData: BookDataInterface, value: number) => 
{
    const { handleOpen } = useModal();

    const openEditBookModal = () =>
    {
        const editData = {
            _id: bookData._id,
            bookname: bookData.bookname,
            language: bookData.languageDetails.language as string,
            genre: bookData.genreDetails.genre as string,
            author: bookData.authorDetails.author as string,
            publisher: bookData.publisherDetails.publisher as string,
            publishDate: bookData.publishDate,
            description: bookData.description,
            imageUrl: bookData.image?.url,
            filename: bookData.image?.filename,
        };

        handleOpen(<EditBookModal value={value} editData={editData} compareData={editData} />);
    };

    const openDeleteBookModal = () =>
    {
        handleOpen(<DeleteBookModal bookID={bookData._id} description={bookData.description} bookname={bookData.bookname} language={bookData.languageDetails.language as string}
            genre={bookData.genreDetails.genre as string} author={bookData.authorDetails.author as string} publisher={bookData.publisherDetails.publisher as string} />);
    };

    return {openEditBookModal, openDeleteBookModal}
}

const BookAdminTableCell: FC<ActionTableCellInterface> = (tableCellData) =>
{
    const { value, Information, changeValue, setSearchBook, searchBook } = tableCellData;
    const bookData = Information as BookDataInterface;

    const { favouriteIconConfig, favouriteHandler } = useFavouriteBookHandler(bookData);
    const { viewLoanBookRecord, openLoanBookModal } = LoanBookHandler(bookData, changeValue, setSearchBook, searchBook);
    const { openEditBookModal, openDeleteBookModal } = BookDataHandler(bookData, value);

   
    const actions = 
    [
        { title: "Edit", syntax: { "&:hover": { backgroundColor: "lightGray" } }, clickEvent: openEditBookModal, icon: <EditIcon /> },
        { title: "Delete (Actual)", syntax: ImportantActionButtonSyntax, clickEvent: openDeleteBookModal, icon: <DeleteIcon />, disable: bookData.status === "OnLoan" },
        { title: "View Loan Book History", syntax: { "&:hover": { backgroundColor: "lightGray" } }, clickEvent: viewLoanBookRecord, icon: <SearchIcon /> },
        { title: "Loan Book", syntax: { "&:hover": { backgroundColor: "lightGray" } }, clickEvent: openLoanBookModal, icon: <EventAvailableIcon />, disable: StatusDetection(bookData.status, "OnLoan") },
        { title: favouriteIconConfig.toolTip, syntax: favouriteIconConfig.syntax, clickEvent: favouriteHandler, icon: favouriteIconConfig.icon },
    ];

    return (
        <TableCell sx={{ marginLeft: "20px" }}>
            {
                actions.map((action, index) => 
                (
                    <Tooltip title={action.title} key={index} arrow>
                        <IconButton sx={action.syntax} onClick={action.clickEvent} disabled={action.disable}>
                            {action.icon}
                        </IconButton>
                    </Tooltip>
                ))
            }
        </TableCell>
    );
};

export default BookAdminTableCell;
