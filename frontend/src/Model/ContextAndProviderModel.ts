import { ReactNode } from "react";
import { BookDataInterface, ContactInterface, DetailsInterfaceForSuspend, LoanBookInterface, UserResultDataInterface } from "./ResultModel";
import { BookTableDataInterface } from "./BookTableModel";
import { ViewProfileModel } from "./InputFieldModel";
import { tableNameType } from "../features/shared/configs/ActionTableCellForAdmin";

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

// For Context
export interface RecommendBookContextProps
{
    suggestBook: (BookDataInterface[] | LoanBookInterface[])[];
    fetchRecommendBook: () => void;
    fetchNewPublishBook: () => Promise<void>;
    fetchMostPopularBook: () => Promise<void>;    
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
    TableName: tableNameType;
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
