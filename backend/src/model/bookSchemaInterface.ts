import mongoose from "mongoose";
import { IDInterface } from "./userSchemaInterface";

export interface BookInterface extends IDInterface
{
    image: ImageInterface;
    bookname: string;
    languageID: mongoose.Schema.Types.ObjectId;
    genreID: mongoose.Schema.Types.ObjectId;
    authorID: mongoose.Schema.Types.ObjectId;
    publisherID: mongoose.Schema.Types.ObjectId;
    status:string;
    pages:number;
    description:string;
    publishDate:Date;
}

export interface ImageInterface
{
    url:string;
    filename:string;
}

export interface GenreInterface extends IDInterface
{
    genre:string,
    shortName:string;
}

export interface LanguageInterface extends IDInterface
{
    shortName:string;
    language:string;
}

export interface PublisherInterface extends IDInterface, ContractDataInterface
{
    publisher:string;
}

export interface AuthorInterface extends IDInterface, ContractDataInterface
{
    author:string;
}

interface ContractDataInterface
{
    phoneNumber:string;
    email:string;
}

export interface BookFavouriteInterface extends IDInterface
{
    bookID: mongoose.Schema.Types.ObjectId;
    userID: mongoose.Schema.Types.ObjectId;
    bookDetails?: BookInterface;
}

export interface BookLoanedInterface extends IDInterface, BookFavouriteInterface
{
    dueDate: Date;
    loanDate: Date;
    returnDate?: Date | null;
    status: string;
    fineAmount: number;
    finesPaid: string;
}