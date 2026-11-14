import { FC, Fragment, lazy, Suspense } from "react"

// UI Fragment
import CustomTabPanel from "../../../component/UIFragment/CustomTabPanel"

// Model
import { BookRecordTableInterface } from "../../../Model/BookTableModel"

const SelfLoanBookTable = lazy(() => import("../../book/components/SelfLoanBookTable"));
const FavouriteBookTable = lazy(() => import("../../book/components/FavouriteBookTable"));


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
            <Suspense fallback={<div>Loading...</div>}>
            {
                SelfRecordTables.map((table, index) => 
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

export default SelfRecordTabPanel