import { FC, Fragment, lazy, Suspense } from "react"

// UI Fragment
import CustomTabPanel from "../../../UIFragment/CustomTabPanel"

// Model
import { BookRecordTableInterface } from "../../../../Model/BookTableModel"

const LoanBookTable = lazy(() => import("../Tables/Book/LoanBookTable"));
const AllBookTable = lazy(() => import("../Tables/Book/AllBookTable"));

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
            <Suspense fallback={<div>Loading...</div>}>
            {
                BookRecordTable.map((table, index) => 
                (
                    <CustomTabPanel key={index} index={index} value={value}>
                        {table}
                    </CustomTabPanel>
                ))
            }
            </Suspense>
        </Fragment>
    )
}

export default BookTabPanel