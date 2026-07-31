import { FC, useContext } from "react";
import { IconButton, TableCell, Tooltip } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, EventAvailable as EventAvailableIcon, Search as SearchIcon, StarBorder as StarBorderIcon, Star as StarIcon } from "@mui/icons-material";

import { ImportantActionButtonSyntax } from "../../../../../../../Data/Style";
import { BookSearchInterface } from "../../../../../../../Model/BookTableModel";
import { ActionTableCellInterface } from "../../../../../../../Model/TablePagesAndModalModel";
import { BookDataInterface, GetResultInterface } from "../../../../../../../Model/ResultModel";
import { useModal } from "../../../../../../../Context/ModalContext";
import { StatusDetection } from "../../../../../../../Controller/OtherUsefulController";
import { useBookContext } from "../../../../../../../Context/Book/BookContext";
import { AlertContext } from "../../../../../../../Context/AlertContext";
import { useSelfBookRecordContext } from "../../../../../../../Context/Book/SelfBookRecordContext";
import EditBookModal from "../../../../../../Modal/Book/EditBookModal";
import DeleteBookModal from "../../../../../../Modal/Confirmation/Book/DeleteBookConfirmModal";
import LoanBookConfirmationModal from "../../../../../../Modal/Confirmation/Book/LoanBookConfirmationModal";

const BookAdminTableCell: FC<ActionTableCellInterface> = (tableCellData) =>
{
    const { handleOpen } = useModal();
    const { fetchLoanBookWithFliterData } = useBookContext();
    const { BookRecordForUser, favouriteBook: favouriteBookHandler, unfavouriteBook: unfavouriteBookHandler } = useSelfBookRecordContext();
    const alertContext = useContext(AlertContext);

    const { value, Information, changeValue, setSearchBook, searchBook } = tableCellData;
    const bookData = Information as BookDataInterface;

    const isFavourite = Boolean(BookRecordForUser[1].find((favouriteBook) => favouriteBook.bookDetails?._id === bookData._id));
    const favouriteBookID = BookRecordForUser[1].find((favouriteBook) => favouriteBook.bookDetails?._id === bookData._id)?._id;

    const favouriteIconSyntax = isFavourite ? { "&:hover": { backgroundColor: "lightGray" }, color: "gold" } : { "&:hover": { backgroundColor: "lightGray" } };

    const viewLoanBookRecord = () =>
    {
        if (changeValue && setSearchBook)
        {
            fetchLoanBookWithFliterData("AllUser", bookData.bookname);
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

    const favouriteHandler = async () =>
    {
        const response = isFavourite ? await unfavouriteBookHandler(favouriteBookID as string) : await favouriteBookHandler(bookData._id);
        const result: GetResultInterface = await response.json();

        if (alertContext && alertContext.setAlertConfig)
        {
            switch (response.status)
            {
                case 200:
                    alertContext.setAlertConfig({ AlertType: "success", Message: result.message as string });
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: result.error as string });
                    break;
            }
        }
    };

    const actions = 
    [
        { title: "Edit", syntax: { "&:hover": { backgroundColor: "lightGray" } }, clickEvent: openEditBookModal, icon: <EditIcon /> },
        { title: "Delete (Actual)", syntax: ImportantActionButtonSyntax, clickEvent: openDeleteBookModal, icon: <DeleteIcon />, disable: bookData.status === "OnLoan" },
        { title: "View Loan Book History", syntax: { "&:hover": { backgroundColor: "lightGray" } }, clickEvent: viewLoanBookRecord, icon: <SearchIcon /> },
        { title: "Loan Book", syntax: { "&:hover": { backgroundColor: "lightGray" } }, clickEvent: openLoanBookModal, icon: <EventAvailableIcon />, disable: StatusDetection(bookData.status, "OnLoan") },
        { title: isFavourite ? "Unfavourite" : "Favourite", syntax: favouriteIconSyntax, clickEvent: favouriteHandler, icon: isFavourite ? <StarIcon /> : <StarBorderIcon /> },
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
