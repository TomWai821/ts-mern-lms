import { ChangeEvent } from "react";
import { BookDataInterface, ContactInterface, LoanBookInterface, UserResultDataInterface } from "./ResultModel";
import { UserDataInterface } from "./UserTableModel";
import { BookTableDataInterface, BookSearchInterface, SelfLoanBookSearchInterface, ContactSearchInterface } from "./BookTableModel"

interface AllFilterInterface
{
    value:number;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    Search: () => void;
    resetFilter?:() => void;
}

export interface FilterInterface extends AllFilterInterface
{
    searchData: UserDataInterface | BookSearchInterface | SelfLoanBookSearchInterface ;
}

export interface ContactFilterInterface extends AllFilterInterface
{
    searchData: ContactSearchInterface;
}

export interface DefinitionFilterInterface extends AllFilterInterface
{
    searchData: {genre:string, language: string};
}

export interface UserActionTableCellInterface
{
    Information: UserResultDataInterface | BookDataInterface | BookTableDataInterface | LoanBookInterface | ContactInterface;
}

export interface ActionTableCellInterface extends UserActionTableCellInterface
{
    value: number;
    TableName: string;
    changeValue?: (type:string, newValue: number) => void;
    setSearchBook?: (data: BookSearchInterface) => void;
    searchBook?: BookSearchInterface;
    setSearchUserData?: (data: { username: string, role: string, status: string, gender: string }) => void;
    searchUserData?: { username: string, role: string, status: string, gender: string };
}

export interface RecordTableCellInterface 
{
    value:number;
    Information: LoanBookInterface;
}

export interface TabInterface
{
    tabLabel: { label: string; }[];
    type:string;
    value: number;
    paginationValue?: number;
    changeValue: (type:string, newValue: number) => void;
    paginationOption?: number[];
}

export interface OptionFieldsInterface
{
    value: number; 
    type:string; 
    optionVisiable:boolean; 
    onChange:(event: ChangeEvent<HTMLInputElement>) => void;
    searchData: any;
}

export interface TableTitleInterface
{
    title:string;
    dataLength:number;
}