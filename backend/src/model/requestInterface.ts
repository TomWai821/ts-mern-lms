import { UserInterface } from "./userSchemaInterface";
import { Request } from 'express'
import { AuthorInterface, BookFavouriteInterface, BookInterface, BookLoanedInterface, PublisherInterface } from "./bookSchemaInterface";

export interface LoginInterface
{
    email:string;
    password:string;
}

export interface CreateUserInterface extends LoginInterface
{
    username: string;
    gender: string;
    role: string;
    birthDay: Date;
    status: string;
    avatarUrl: string;
}

export interface ModifyUserDataInterface
{
    username: string;
    email: string;
    gender: string;
    role: string;
    status: string;
    description: string;
    startDate: Date;
    dueDate: Date;
}

export interface AuthRequest extends Request
{
    user?: UserInterface;
    foundUser?: UserInterface | UserInterface[] | null;
    updateData?: Record<string, any> | null;
    foundBook?: BookInterface | BookInterface[] | null;
    foundAuthor?: AuthorInterface | AuthorInterface[] | null;
    foundPublisher?: PublisherInterface | PublisherInterface[] | null;
    foundLoanedRecord?: BookLoanedInterface | BookLoanedInterface[] | null;
    foundFavouriteBook?: BookFavouriteInterface | BookFavouriteInterface[] | null;
}

export interface Book 
{
    _id: string;
    bookname: string;
    genre: string;
    author: string;
    publisher: string;
}

export interface externalDataInterface
{
    items: ItemsInterface[];
    totalItems?: number;
}

export interface ItemsInterface
{
    volumeInfo: VolumeInfoInterface;
    saleInfo: SaleInfoInterface;
}

interface VolumeInfoInterface
{
    averageRating:string;
    ratingsCount:string;
    industryIdentifiers?: IndustryIdentifiersInterface[];
    categories?:string;
}

interface IndustryIdentifiersInterface
{
    type:string;
    identifier:string;
}

interface SaleInfoInterface
{
    saleability: string;
    isEbook: boolean;
    listPrice?: PriceInterface;
    retailPrice?: PriceInterface;
}

interface PriceInterface
{
    amount:number;
    currencyCode:string;
}