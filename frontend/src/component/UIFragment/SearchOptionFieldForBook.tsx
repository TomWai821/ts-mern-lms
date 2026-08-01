import { FC, Fragment } from "react"
import { Box, Card, Typography } from "@mui/material"

import { BookOptionFieldModal } from "../../Model/InputFieldModel";
import { useDefinitionContext } from "../../Context/Book/DefinitionContext";
import { useContactContext } from "../../Context/Book/ContactContext";
import { BookTableDataInterface } from "../../Model/BookTableModel";

import DefinitionFieldSection from "./SearchOptionsSection/DefinitionFieldSection";
import ContactFieldSection from "./SearchOptionsSection/ContactFieldSection";
import SearchFieldSection from "./SearchOptionsSection/SearchFieldSection";


const useSearchOptions = (searchData: BookTableDataInterface) => 
{
    const {definition} = useDefinitionContext();
    const {contact} = useContactContext();

    const definitionFields = 
    [
        { title: "Genre", name: "genre", value: searchData.genre, dataType: definition[0], keyProperty: "genre", descriptionProperty: "shortName" },
        { title: "Language", name: "language", value: searchData.language, dataType: definition[1], keyProperty: "language", descriptionProperty: "shortName" },
    ];
    
    const contactFields = 
    [
        { title: "Author", name: "author", value: searchData.author, dataType: contact[0], keyProperty: "author" },
        { title: "Publisher", name: "publisher", value: searchData.publisher, dataType: contact[1], keyProperty: "publisher" },
    ];
    
    return { definitionFields, contactFields };
}


const SearchOptionFieldForBook:FC<BookOptionFieldModal> = ({...optionData}) =>
{
    const { optionVisiable, onChange, SearchField, searchData } = optionData;
    const { definitionFields, contactFields } = useSearchOptions(searchData as unknown as BookTableDataInterface);

    if (!optionVisiable) 
    {
        return null;
    }
   
    return(
        <Fragment>
            {optionVisiable && (
                <Card sx={{padding: '15px' }}>
                    <Typography>Options</Typography>
                    <Box sx={{ padding: '15px 20px', display: 'grid', justifyContent: 'center', alignItems: 'center', gap: '15px 50px', gridTemplateColumns: '10% 30% 10% 30%' }}>
                        {  
                            SearchField ? SearchFieldSection(SearchField, searchData, onChange)
                            :
                            <Fragment>
                                {
                                    DefinitionFieldSection({ definitionFields, onChange })
                                }

                                {
                                    ContactFieldSection({ contactFields, onChange })
                                }
                            </Fragment>
                        }
                    </Box>
                </Card>
            )}
        </Fragment>
    )
}


export default SearchOptionFieldForBook