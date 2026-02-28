import { ReactNode } from "react";
import { BookDataInterface, ContactInterface, DefinitionState, GetResultInterface, LoanBookInterface, UserResultDataInterface } from "./ResultModel";
import { UserDataInterface } from "./UserTableModel";
import { BookTableDataInterface } from "./BookTableModel";

export interface ChildProps
{
    children: ReactNode;
}

// For Alert
export interface AlertConfig
{
    AlertType: 'success' | 'info' | 'warning' | 'error';
    Message: string;
}

export interface AlertContextProps
{
    setAlertConfig: (config: AlertConfig | null) => void;
}

// For modal
export interface ModalContextProps
{
    open: boolean;
    handleOpen: (content: ReactNode) => void;
    handleClose: () => void
    content: ReactNode;
}

export interface ModalTemplateProps extends ChildProps
{
    title: string;
    minWidth?: string;
    maxWidth?: string;
    width?:string;
    cancelButtonName: string;
    cancelButtonEvent?: () => void;
}

export interface AuthContextProps
{
    IsLoggedIn: () => boolean;
    GetData: (data:string)  => string | undefined | null;
    IsAdmin: () => boolean;
    handleLogout: (username: string | null) => void;
}

// For Context
export interface UserContextProps
{
    userData: UserResultDataInterface[][];
    fetchAllUser: () => Promise<void>;
    fetchUser: (type:string, UserData: {username?: string, role?: string , status?: string, gender?: string} | undefined) => Promise<void>;
    createUser: (registerPosition:string, username:string, email:string, password:string, role:string, gender:string, birthDay:string) => Promise<boolean>;
    editUserData: (userId:string, username: string, email: string, gender: string, role: string) => Promise<boolean>;
    editSuspendUserData: (userId:string, bannedListID: string, dueDate: Date, description: string) => Promise<boolean>;
    changeUserStatus: (type:string, userId:string, status:string, ListID?:string, duration?:number, description?:string) => Promise<boolean | void>;
    actualDeleteUser: (userId:string) => Promise<boolean>;
}

export interface BookContextProps
{
    bookData:(BookDataInterface[] | LoanBookInterface[])[];
    fetchAllRecord: () => Promise<void>;
    fetchAllBook: () => Promise<void>;
    fetchBookWithFliterData: (bookname?:string, status?:string, genreID?:string, languageID?:string, authorID?:string, publisherID?:string) => Promise<void>;
    fetchLoanBookWithFliterData: (type:string, bookname?:string, username?:string, status?:string, finesPaid?:string) => Promise<void>;
    createBook: (image:File, bookname:string, genreID:string, languageID:string, publisherID:string, authorID:string, description:string, publishDate:string) => Promise<boolean>;
    editBook: (bookID:string, imageName:string, newFile:File, bookname:string, genreID:string, languageID:string, publisherID:string, publishDate:string, authorID:string, description:string) => Promise<boolean>;
    loanBook: (bookID:string, userID?:string) => Promise<Response>;
    returnBook: (loanRecordID:string, finesPaid?:string) => Promise<boolean>;
    deleteBook: (bookID:string) => Promise<boolean>;
    getExternalData: (bookname: string, author: string) => Promise<GetResultInterface | undefined>;
}

export interface RecommendBookContextProps
{
    suggestBook: (BookDataInterface[] | LoanBookInterface[])[];
    fetchRecommendBook: () => void;
    fetchNewPublishBook: () => Promise<void>;
    fetchMostPopularBook: () => Promise<void>;    
}

export interface SelfBookRecordContextProps
{
    BookRecordForUser: LoanBookInterface[][];
    bookForUser: BookDataInterface[];
    fetchFavouriteRecord: () => Promise<void>;
    fetchSelfLoanRecord: () => Promise<boolean>;
    GetSuggestData: (suggestBookData: LoanBookInterface[]) => Promise<{ bookname: string; genre: any; author: any; publisher: any; }[]>;
    fetchSelfFavouriteBookWithFilterData: (bookname?:string, status?:string, genreID?:string, languageID?:string, authorID?:string, publisherID?:string) => Promise<void>;
    fetchSelfLoanBookWithFilterData: (type:string, bookname?:string, status?:string) => Promise<void>;
    favouriteBook: (bookID:string) => Promise<boolean>;
    unfavouriteBook: (favouriteBookID:string) => Promise<boolean>;
}

export interface DefinatonProps
{
    definition: DefinitionState;
    fetchAllDefinition: () => Promise<void>;
    fetchDefinitionDataWithFilterData:(type:string, data:string) => Promise<void>;
    createDefinition:(type:string, shortName:string, detailsName:string) => Promise<boolean>;
    editDefinition:(type:string, id:string, shortName:string, detailsName:string) => Promise<boolean>;
    deleteDefinition:(type:string, id:string) => Promise<boolean>;
}

export interface ContactProps
{
    contact: ContactState;
    fetchAllContactData: () => Promise<void>;
    fetchContactDataWithFilterData: (type:string, author:string, publisher:string) => Promise<void>;
    createContactData:(type:string, contactName:string, phoneNumber:string, email:string) => Promise<boolean>;
    editContactData:(type:string, id:string, contactName:string, phoneNumber:string, email:string) => Promise<boolean>;
    deleteContactData:(type:string, id:string) => Promise<boolean>;
}

// For Tab Panel
export interface TabPanelProps extends ChildProps
{
    index: number;
    value: number;
}

// For ContentTableCell
export interface ContentTableCellProps extends ChildProps
{
    TableName: string;
    value: number;
    textColor?:string;
    Information: UserResultDataInterface | BookDataInterface | BookTableDataInterface | LoanBookInterface | ContactInterface;
}

export interface SuggestionData 
{
    topGenres: string[];
    topAuthors: string[];
    topPublishers: string[];
}

export interface ContactState
{
    Author: ContactInterface[];
    Publisher: ContactInterface[];
}
