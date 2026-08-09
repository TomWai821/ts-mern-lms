import { FC, Fragment } from "react"

// UI Fragment
import CustomTabPanel from "../../../UIFragment/CustomTabPanel"

// 
import AuthorTable from "../Tables/Contact/AuthorTable"
import PublisherTable from "../Tables/Contact/PublisherTable"

// Model
import {ContactTableInterface } from "../../../../Model/BookTableModel"

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
            {
                ContactTable.map((table, index) => 
                (
                    <CustomTabPanel key={index} index={index} value={value as number}>
                        {table}
                    </CustomTabPanel>
                ))
            }
        </Fragment>
    )
}

export default ContactTabPanel