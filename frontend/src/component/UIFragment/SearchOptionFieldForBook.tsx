import { ChangeEvent, FC, Fragment } from "react"
import { Box, Card, MenuItem, TextField, Typography } from "@mui/material"

import { BookOptionFieldModal } from "../../Model/InputFieldModel";
import { useDefinitionContext } from "../../Context/Book/DefinitionContext";
import { useContactContext } from "../../Context/Book/ContactContext";
import { ContactInterface, DefinitionInterface } from "../../Model/ResultModel";

const SearchOptionFieldForBook:FC<BookOptionFieldModal> = ({...optionData}) =>
{
    const {optionVisiable, onChange, SearchField, searchData} = optionData;
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
                        {  SearchField ? 
                        SearchField.map((field, index) => 
                            (
                                <Fragment key={index}>
                                    <Typography>{field.label}</Typography>
                                    <TextField name={field.name} value={(searchData as any)[field.name]} type={field.type} size="small" select={field.select} slotProps={field.slotProps}
                                        onChange={ (event) => { onChange(event as ChangeEvent<HTMLInputElement>)} }
                                    >
                                        {
                                            field.select && field.options?.map((option, index) => 
                                            (
                                                <MenuItem key={index} value={option} sx={{height: '40px'}}>{option}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Fragment>
                            )) 
                        :
                        <Fragment>
                            {
                                definitionFields.map((field, index) => 
                                (
                                    <Fragment key={index}>
                                        <Typography>{field.title}</Typography>
                                        <TextField name={field.name} value={field.value} size="small" select
                                            onChange={(event) => 
                                            {
                                                const selectedIndex = field.dataType.findIndex( (item) => item[field.keyProperty as keyof DefinitionInterface ] === event.target.value);
                                                onChange(event as ChangeEvent<HTMLInputElement>, selectedIndex);
                                            }}
                                        >
                                            {field.dataType.map((item, index) => 
                                            (
                                                <MenuItem key={index} value={item[field.keyProperty as keyof DefinitionInterface]}>
                                                    {`${item[field.keyProperty as keyof DefinitionInterface]} (${item[field.descriptionProperty as keyof DefinitionInterface]})`}
                                                </MenuItem>
                                            ))}
                                            <MenuItem value="All" sx={{ height: "40px" }}>All</MenuItem>
                                        </TextField>
                                    </Fragment>
                                ))
                            }

                            {
                                contactFields.map((field, index) => 
                                (
                                    <Fragment key={index}>
                                        <Typography>{field.title}</Typography>
                                        <TextField name={field.name} value={field.value} size="small" select
                                            onChange={(event) => 
                                            {
                                                const selectedIndex = field.dataType.findIndex( (item) => item[field.keyProperty as keyof ContactInterface] === event.target.value);
                                                onChange(event as ChangeEvent<HTMLInputElement>, selectedIndex);
                                            }}
                                        >
                                            {field.dataType.map((item, index) => 
                                            (
                                                <MenuItem key={index} value={item[field.keyProperty as keyof ContactInterface]}>
                                                    {item[field.keyProperty as keyof ContactInterface]}
                                                </MenuItem>
                                            ))}
                                            <MenuItem value="All" sx={{ height: "40px" }}>All</MenuItem>
                                        </TextField>
                                    </Fragment>
                                ))
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