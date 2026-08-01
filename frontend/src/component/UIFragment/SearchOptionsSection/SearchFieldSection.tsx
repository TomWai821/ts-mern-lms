import { Typography, TextField, MenuItem } from "@mui/material";
import { ChangeEvent } from "react";
import { Fragment } from "react/jsx-runtime";

interface ISearchField
{
    label: string;
    name: string;
    type: string;
    select?: boolean | undefined;
    slotProps?: object | undefined;
    options?: string[] | undefined;
}

const SearchFieldSection = (searchFields: ISearchField[], searchData: any, onChange: (event: ChangeEvent<HTMLInputElement>) => void) => 
{
    return(
        <Fragment>
            {
                searchFields.map((field, index) => 
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
            }
        </Fragment>
    )
}

export default SearchFieldSection;