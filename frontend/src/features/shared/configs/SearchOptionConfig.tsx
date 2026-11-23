import { FC, Fragment } from "react";
import SearchOptionField from "../../../component/UIFragment/SearchOptionField";
import { OptionFieldsInterface } from "../../../Model/TablePagesAndModalModel";

import SearchOptionFieldForBook from "../../../component/UIFragment/SearchOptionFieldForBook";
import { AllUserSearchField, OtherUserSearchField, SearchLoanBookInputField } from "../../../Data/TextFieldsData";


const SearchOptionConfig:FC<OptionFieldsInterface> = (searchOptionFieldData) => 
{
    const {value, type, optionVisiable, onChange, searchData} = searchOptionFieldData;

    const OptionType=
    {
        Book:
        [
            <SearchOptionFieldForBook key="all-books" optionVisiable={optionVisiable} onChange={onChange} searchData={searchData}/>,
            <SearchOptionFieldForBook key="loaned-books" optionVisiable={optionVisiable} onChange={onChange} SearchField={SearchLoanBookInputField} searchData={searchData}/>,
        ],
        User:
        [
            <SearchOptionField key="all-users" optionVisiable={optionVisiable} onChange={onChange} SearchField={AllUserSearchField} searchData={searchData} />,
            <SearchOptionField key="other-users" optionVisiable={optionVisiable} onChange={onChange} SearchField={OtherUserSearchField} searchData={searchData} />
        ],
        Record:
        [
            <Fragment key="empty-record-search"/>,
            <SearchOptionFieldForBook key="record-book-search" optionVisiable={optionVisiable} onChange={onChange} searchData={searchData}/>
        ]
    }

    return OptionType[type as keyof typeof OptionType][value];
}

export default SearchOptionConfig;
