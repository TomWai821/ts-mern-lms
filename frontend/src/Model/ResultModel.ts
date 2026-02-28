import { UserDataInterface } from "./UserTableModel";

export interface ResultInterface
{
    data: RegisterDataInterface;
    qrCodeDataUrl?:string;
}

export interface RegisterDataInterface
{
    authToken: string;
    username: string;
    role: string;
    avatarUrl:string;
    status: string;
}

export interface GetResultInterface
{
    success:boolean;
    message?: string;
    error?:string;
    authtoken?:string;
    foundUser?: UserResultDataInterface | UserResultDataInterface[];
    foundBook?: BookDataInterface | BookDataInterface[];
    foundDefinition?: DefinitionInterface | DefinitionInterface[];
    foundContact?: ContactInterface | ContactInterface[];
    foundLoanBook?: LoanBookInterface | LoanBookInterface[];
    foundFavouriteBook?: BookDataInterface | BookDataInterface[];
    foundExternalBook?: ExternalBookDataInterface;
}

export interface ExternalBookDataInterface
{
    averageRating: string,
    ratingsCount: string,
    categories: string,
    saleability: string,
    listPrice: string,
    retailPrice: string,
    ISBN_13_Code: string,
    ISBN_10_Code: string
}

export interface UserResultDataInterface extends UserDataInterface
{
    _id:string;
    avatarUrl?:string;
    bannedDetails?: DetailsInterfaceForSuspend;
}

export interface BookDataInterface
{
    _id:string;
    image?: ImageInterface;
    bookname:string;
    genreID:string;
    genre?:string;
    language?:string;
    languageID:string;
    author?:string;
    authorID:string;
    publisher?:string;
    publisherID:string;
    status:string;
    description: string;
    genreDetails: DefinitionInterface;
    languageDetails: DefinitionInterface;
    authorDetails: ContactInterface;
    publisherDetails: ContactInterface;
    publishDate: Date | string;
}

export interface BookDataInterfaceForEdit
{
    _id:string;
    bookname:string;
    genre?:string;
    language?:string;
    author?:string;
    publisher?:string;
    publishDate?:string;
    description:string;
    status:string;
    filename:string;
    imageUrl:string;
    image?:File;
}

export interface ImageInterface
{
    url?:string;
    filename?:string;
}

export interface DetailsInterfaceForSuspend
{
    _id:string;
    userID:string;
    description:string;
    unSuspendDate?: Date| string;
    startDate: Date | string;
    dueDate: Date | string;
    status:string;
}

export interface DefinitionResultInterface
{
    success:boolean;
    foundData: DefinitionInterface | DefinitionInterface[];
}

export interface DefinitionInterface
{
    _id:string;
    shortName:string;
    language?:string;
    genre?:string;
}

export interface DefinitionState
{
    Genre: DefinitionInterface[];
    Language: DefinitionInterface[];
}

export interface ContactInterface
{
    _id:string;
    publisher?:string;
    author?:string;
    email:string;
    phoneNumber:string;
}

export interface LoanBookInterface
{
    _id:string;
    userDetails?: UserDataInterface;
    bookDetails?: BookDataInterface;
    authorDetails?: any;
    languageDetails?: any;
    publisherDetails?: any;
    genreDetails?:any;
    loanDate?:string | Date;
    dueDate?:string | Date;
    returnDate?:string | Date;
    status:string;
    count?:string;
    fineAmount?:number;
    finesPaid?:string;
}

export interface errorResponse
{
    success: boolean;
    error: string;
}