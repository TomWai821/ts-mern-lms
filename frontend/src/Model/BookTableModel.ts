
import { BookDataInterface, ContactInterface, LoanBookInterface } from "./ResultModel";

interface BookSearchInterface extends SelfLoanBookSearchInterface, ContactSearchInterface
{
    username:string;
    language:string;
    genre:string;
    finesPaid?:string;
}

interface SelfLoanBookSearchInterface
{
    bookname:string;
    status:string;
}

interface ContactSearchInterface
{
    author:string;
    publisher:string;
}

interface BookTableDataInterface extends ContactSearchInterface
{
    bookname:string;
    language:string;
    genre:string;
    description:string;
}

interface BookDataInterfaceForDelete extends BookTableDataInterface
{
    bookID:string;
}

interface BookRecordTableInterface
{
    value: number;
    bookData: (BookDataInterface[] | LoanBookInterface[])[] | LoanBookInterface[];
    paginationValue:number;
    changeValue?: (type: string, newValue: number) => void;
    setSearchBook?: (data: BookSearchInterface) => void;
    searchBook?: BookSearchInterface;
}

interface ContactTableInterface
{
    value: number;
    contactData: ContactInterface[][];
    paginationValue:number;
}

export type {BookSearchInterface, SelfLoanBookSearchInterface, ContactSearchInterface, BookTableDataInterface, BookDataInterfaceForDelete, BookRecordTableInterface, ContactTableInterface}