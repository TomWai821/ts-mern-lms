import { FC, Fragment } from "react"

// UI Fragment
import CustomTabPanel from "../../../UIFragment/CustomTabPanel"

// Model
import { BookRecordTableInterface } from "../../../../Model/BookTableModel"
import SelfLoanBookTable from "../Tables/Book/SelfLoanBookTable";
import FavouriteBookTable from "../Tables/Book/FavouriteBookTable";

const SelfRecordTabPanel:FC<BookRecordTableInterface> = (TabData) =>
{
    const {value, bookData, paginationValue} = TabData;
    
    const SelfRecordTables = 
    [
        <SelfLoanBookTable value={value} bookData={bookData} paginationValue={paginationValue}/>, 
        <FavouriteBookTable value={value} bookData={bookData} paginationValue={paginationValue}/>
    ];

    return(
        <Fragment>
            {
                SelfRecordTables.map((table, index) => 
                (
                    <CustomTabPanel key={index} index={index} value={value}>
                        {table}
                    </CustomTabPanel>
                ))
            }
        </Fragment>
    )
}

export default SelfRecordTabPanel