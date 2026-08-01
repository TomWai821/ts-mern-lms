import { FC, Fragment } from "react"

// UI Fragment
import CustomTabPanel from "../../../UIFragment/CustomTabPanel"

// 
import LoanBookTable from "../Tables/Book/LoanBookTable"
import AllBookTable from "../Tables/Book/AllBookTable"

// Model
import { BookRecordTableInterface } from "../../../../Model/BookTableModel"

const BookTabPanel:FC<BookRecordTableInterface> = (TabData) =>
{
    const {value, bookData, paginationValue, changeValue, setSearchBook, searchBook} = TabData;

    const BookRecordTable = 
    [
        <AllBookTable bookData={bookData} value={value} paginationValue={paginationValue} changeValue={changeValue} setSearchBook={setSearchBook} searchBook={searchBook}/>,
        <LoanBookTable bookData={bookData} value={value} paginationValue={paginationValue}/>
    ];
    
    return(
        <Fragment>
            {
                BookRecordTable.map((table, index) => 
                (
                    <CustomTabPanel key={index} index={index} value={value}>
                        {table}
                    </CustomTabPanel>
                ))
            }
        </Fragment>
    )
}

export default BookTabPanel