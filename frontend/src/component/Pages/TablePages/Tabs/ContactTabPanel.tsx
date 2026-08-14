import { FC, Fragment, lazy, Suspense } from "react"

// UI Fragment
import CustomTabPanel from "../../../UIFragment/CustomTabPanel"

// Model
import { ContactTableInterface } from "../../../../Model/BookTableModel"

const AuthorTable = lazy(() => import("../Tables/Contact/AuthorTable"));
const PublisherTable = lazy(() => import("../Tables/Contact/PublisherTable"));


const ContactTabPanel:FC<ContactTableInterface> = (TabData) =>
{
    const {value, contactData, paginationValue} = TabData;

    const ContactTable = 
    [
        <AuthorTable value={value} contactData={contactData} paginationValue={paginationValue}/>,
        <PublisherTable value={value} contactData={contactData} paginationValue={paginationValue}/>
    ];
    
    return(
        <Fragment>
            <Suspense fallback={<div>Loading...</div>}>
            {
                ContactTable.map((table, index) => 
                (
                    <CustomTabPanel key={index} index={index} value={value as number}>
                        {table}
                    </CustomTabPanel>
                ))
            }
            </Suspense>
        </Fragment>
    )
}

export default ContactTabPanel