import { FC, useContext } from "react"
import { IconButton, TableCell, Tooltip } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Block as BlockIcon, LockOpen as LockOpenIcon, History as HistoryIcon, EventAvailable as EventAvailableIcon, Search as SearchIcon } from '@mui/icons-material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// Context
import { useModal } from "../../../../../Context/ModalContext";

// Useful function 
import { DisableValidationForLoanBook, StatusDetection } from "../../../../../Controller/OtherUsefulController";

// Another Modal
import EditUserModal from "../../../../Modal/User/EditUserModal";
import EditBookModal from "../../../../Modal/Book/EditBookModal";
import DeleteUserConfirmModal from "../../../../Modal/Confirmation/User/DeleteUserConfirmModal";
import DeleteBookModal from "../../../../Modal/Confirmation/Book/DeleteBookConfirmModal";
import SuspendUserModal from "../../../../Modal/User/SuspendUserModal";
import UndoUserActivityModal from "../../../../Modal/Confirmation/User/UndoUserActivityModal";
import EditSuspendUserModal from "../../../../Modal/User/EditSuspendUserModal";
import ReturnBookConfirmModal from "../../../../Modal/Confirmation/Book/ReturnBookConfirmModal";
import DeleteContactConfirmModal from "../../../../Modal/Confirmation/Contact/DeleteContactConfirmModal";
import EditContactModal from "../../../../Modal/Contact/EditContactModal";
import LoanBookConfirmationModal from "../../../../Modal/Confirmation/Book/LoanBookConfirmationModal";

// Model
import { ActionTableCellInterface } from "../../../../../Model/TablePagesAndModalModel"
import { BookDataInterface, DetailsInterfaceForSuspend, LoanBookInterface, UserResultDataInterface } from "../../../../../Model/ResultModel";

// Data(CSS Syntax)
import { ImportantActionButtonSyntax } from "../../../../../Data/Style";
import { useBookContext } from "../../../../../Context/Book/BookContext";
import { AlertContext } from "../../../../../Context/AlertContext";
import SubmitFinesConfirmModal from "../../../../Modal/Confirmation/Book/SubmitFineConfirmation";
import { BookSearchInterface } from "../../../../../Model/BookTableModel";
import { useSelfBookRecordContext } from "../../../../../Context/Book/SelfBookRecordContext";
import { useUserContext } from "../../../../../Context/User/UserContext";

const ActionTableCellForAdmin: FC<ActionTableCellInterface> = ({...tableCellData}) => 
{
    const { handleOpen } = useModal();
    const { fetchLoanBookWithFliterData} = useBookContext();
    const { fetchUser } = useUserContext();
    const { BookRecordForUser, favouriteBook, unfavouriteBook } = useSelfBookRecordContext();
    const alertContext = useContext(AlertContext);


    const { value, TableName, Information, changeValue, setSearchBook, searchBook, setSearchUserData, searchUserData } = tableCellData;
    const userData = Information as UserResultDataInterface;
    
    const isFavourite = BookRecordForUser[1].find((favouriteBook) => favouriteBook.bookDetails?._id === (Information as BookDataInterface)._id);
    const FavouriteID = BookRecordForUser[1].find((favouriteBook) => favouriteBook.bookDetails?._id === (Information as BookDataInterface)._id as string)?._id;

    const openEditModal = () => 
    {
        switch (TableName) 
        {
            case "Book":
                const data = Information as BookDataInterface;
                const Data = { _id: data._id, bookname: data.bookname, language: data.languageDetails.language as string, genre: data.genreDetails.genre as string, 
                    author: data.authorDetails.author as string, publisher: data.publisherDetails.publisher as string, publishDate: data.publishDate, 
                    description: data.description, imageUrl: data.image?.url, filename: data.image?.filename}
                handleOpen(<EditBookModal value={value} editData={Data} compareData={Data}/>);
                break;
                
            case "User":
                handleOpen(<EditUserModal value={value} editData={userData} compareData={userData}/>);
                break;

            case "Contact":
                handleOpen(<EditContactModal value={value} editData={Information} compareData={Information}/>);
                break;
        }
    }

    const openDeleteBookModal = () => 
    {
        const data = Information as BookDataInterface;

        handleOpen(<DeleteBookModal bookID={data._id} description={data.description} bookname={data.bookname} language={data.languageDetails.language as string} 
            genre={data.genreDetails.genre as string} author={data.authorDetails.author as string}  publisher={data.publisherDetails.publisher as string} />);
    }

    const openAnotherModal = (type:string) => 
    {
        const ModalTypeMap: Record<string, JSX.Element> = 
        {
            "Suspend" : <SuspendUserModal {...Information as UserResultDataInterface}/>,
            "EditSuspendData": <EditSuspendUserModal value={value} editData={userData.bannedDetails as DetailsInterfaceForSuspend} 
                compareData={userData.bannedDetails as DetailsInterfaceForSuspend}/>,
            "UndoAction": <UndoUserActivityModal _id={userData._id} data={userData} />,
            "ReturnBook": <ReturnBookConfirmModal data={Information as LoanBookInterface} modalOpenPosition={"AdminTableCell"}/>,
            "SubmitFines": <SubmitFinesConfirmModal modalOpenPosition={""} data={Information as LoanBookInterface}/>,
            "DeleteUser": <DeleteUserConfirmModal value={value} _id={userData._id} data={userData} />,
            "DeleteContact": <DeleteContactConfirmModal value={value} _id={(Information as LoanBookInterface)._id} data={Information}/>
        }

        if(!ModalTypeMap[type])
        {
            console.log(`Invalid type: ${type}!`);
            return;
        }

        handleOpen(ModalTypeMap[type])
    }

    const openLoanBookModal = () => 
    {
        const bookData = Information as BookDataInterface;
        handleOpen(<LoanBookConfirmationModal tabValue={0} _id={bookData._id} bookname={bookData.bookname} author={bookData.authorDetails.author as string} 
            language={bookData.languageDetails.language as string} genre={bookData.genreDetails.genre as string} description={bookData.description as string} 
            imageUrl={bookData.image?.url as string} />)
    }

    const FavouriteHandler = async () => 
    {
        let response = isFavourite ? await unfavouriteBook(FavouriteID as string) : await favouriteBook((Information as BookDataInterface)._id); 
        const favouriteText = isFavourite ? "Unfavourite" : "Favourite";

        if (alertContext && alertContext.setAlertConfig) 
        {
            switch(response.status)
            {
                case 200:
                    alertContext.setAlertConfig({ AlertType: "success", Message: `${favouriteText} successfully!` });
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: `Failed to ${favouriteText}! Please try again` });
                    break;
            }
        }
    }

    const ViewRecord = (type:string) => 
    {
        switch(type)
        {
            case "LoanBook":
                if (changeValue && setSearchBook) 
                {
                    fetchLoanBookWithFliterData("AllUser", (Information as BookDataInterface).bookname);
                    changeValue("Tab", 1);
                    setSearchBook({ ...searchBook as BookSearchInterface, bookname: (Information as BookDataInterface).bookname });
                }
                break;

            case "Suspend":
                if (changeValue && setSearchUserData) 
                {
                    fetchUser("SuspendUser", {username: (Information as UserResultDataInterface).username, role: "", status: "",gender: ""});
                    changeValue("Tab", 1);
                    setSearchUserData({ ...searchUserData as UserResultDataInterface, username: (Information as UserResultDataInterface).username})
                }
                break;

            default:
                console.log(`Invalid type: ${type}!`);
                break;
        }
    };

    const FavouriteIconSyntax = () => 
    {
        return isFavourite ? { "&:hover": { backgroundColor: 'lightGray' }, color: 'gold' } : { "&:hover": { backgroundColor: 'lightGray' } };
    }

    const tableCell: Record<string, Record<number, Array<{title: string, syntax: object, clickEvent: () => void, icon: JSX.Element, disable?: boolean}>>> = 
    {
        User: 
        {
            0: 
            [
                { title: "Edit", syntax: { "&:hover": { backgroundColor: 'lightGray' } }, clickEvent: openEditModal, icon: <EditIcon /> },
                { title: "View Suspend History", syntax: { "&:hover": { backgroundColor: 'lightGray' } }, clickEvent: () => ViewRecord("Suspend"), icon: <SearchIcon /> },
                { title: "Suspend User", syntax: ImportantActionButtonSyntax, clickEvent: () => openAnotherModal("Suspend"), icon: <BlockIcon />, 
                    disable: StatusDetection(userData.status, "Suspend")},
                { title: "Delete User", syntax: ImportantActionButtonSyntax, clickEvent: () => openAnotherModal("DeleteUser"), icon: <DeleteIcon />,
                    disable: StatusDetection(userData.status, "Suspend")}
            ],
            1: 
            [
                { title: "Edit", syntax: { "&:hover": { backgroundColor: 'lightGray' } }, clickEvent: () => openAnotherModal("EditSuspendData"), icon: <EditIcon />, 
                    disable: StatusDetection(userData.bannedDetails?.status as string, "Unsuspend") },
                { title: "Unsuspend User", syntax: ImportantActionButtonSyntax, clickEvent: () => openAnotherModal("UndoAction"), icon: <LockOpenIcon />, 
                    disable: StatusDetection(userData.bannedDetails?.status as string, "Unsuspend") }
            ]
        },
        Book: 
        {
            0: 
            [
                { title: "Edit", syntax: { "&:hover": { backgroundColor: 'lightGray' } }, clickEvent: openEditModal, icon: <EditIcon /> },
                { title: "Delete (Actual)", syntax: ImportantActionButtonSyntax, clickEvent: openDeleteBookModal, icon: <DeleteIcon />, disable: (Information as BookDataInterface).status === "Loaned" },
                { title: "View Loan Book History", syntax: { "&:hover": { backgroundColor: 'lightGray' } }, clickEvent: () => ViewRecord("LoanBook"), icon: <SearchIcon /> },
                { title: "Loan Book", syntax: { "&:hover": { backgroundColor: 'lightGray' } }, clickEvent: openLoanBookModal, icon: <EventAvailableIcon />, 
                    disable: StatusDetection((Information as LoanBookInterface).status, "Loaned") },
                { title: isFavourite ? "Unfavourite" : "Favourite", syntax: FavouriteIconSyntax, clickEvent: FavouriteHandler, icon: isFavourite ? <StarIcon /> : <StarBorderIcon /> }
            ],
            1: 
            [
                { title: "Return Book", syntax: ImportantActionButtonSyntax, clickEvent: () => openAnotherModal("ReturnBook"), icon: <HistoryIcon />,
                    disable: DisableValidationForLoanBook(Information as LoanBookInterface) },
                { title: "Submit fines", syntax: ImportantActionButtonSyntax, clickEvent: () => openAnotherModal("SubmitFines"), icon: <AttachMoneyIcon />, 
                    disable: !((Information as LoanBookInterface).finesPaid === "Not Paid" && (Information as LoanBookInterface).status as string === "Returned(Late)") }
            ]
        },
        Contact: 
        {
            0: 
            [
                { title: "Edit", syntax: { "&:hover": { backgroundColor: 'lightGray' } }, clickEvent: openEditModal, icon: <EditIcon /> },
                { title: "Delete Author", syntax: ImportantActionButtonSyntax, clickEvent: () => openAnotherModal("DeleteContact"), icon: <DeleteIcon /> }
            ],
            1: 
            [
                { title: "Edit", syntax: { "&:hover": { backgroundColor: 'lightGray' } }, clickEvent: openEditModal, icon: <EditIcon /> },
                { title: "Delete Publisher", syntax: ImportantActionButtonSyntax, clickEvent: () => openAnotherModal("DeleteContact"), icon: <DeleteIcon /> }
            ]
        }
    };

    const actionsToRender = tableCell[TableName]?.[value] || [];

    return(
        <TableCell sx={{marginLeft: '20px'}}>
            {
                actionsToRender.map((actions, index) => 
                (
                    <Tooltip title={actions.title} key={index} arrow>
                        <IconButton sx={actions.syntax} onClick={actions.clickEvent} disabled={actions.disable}>
                            {actions.icon}
                        </IconButton>
                    </Tooltip>
                ))
            }
        </TableCell>
    );
}

export default ActionTableCellForAdmin