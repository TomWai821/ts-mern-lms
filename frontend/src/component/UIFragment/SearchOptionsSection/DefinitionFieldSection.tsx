import { ChangeEvent, FC, Fragment } from "react";
import { DefinitionInterface } from "../../../Model/ResultModel";
import { Typography, TextField, MenuItem } from "@mui/material";

interface DefinitionFieldsSectionProps
{
    definitionFields: DefinitionFields[];
    onChange: (event: ChangeEvent<HTMLInputElement>, selectedIndex: number) => void;
}

interface DefinitionFields
{
    title: string;
    name: string;
    value: string;
    dataType: DefinitionInterface[];
    keyProperty: string;
    descriptionProperty: string;
}

const optionFieldSlotProps = {select: { MenuProps: {PaperProps: { style: { maxHeight: 300 }}}}}

const DefinitionFieldSection:FC<DefinitionFieldsSectionProps> = (props) =>
{
    const { definitionFields, onChange } = props;

    return(
        <Fragment>
            {
                definitionFields.map((field, index) => 
                (
                    <Fragment key={index}>
                        <Typography>{field.title}</Typography>
                        <TextField name={field.name} value={field.value} size="small" select  slotProps={optionFieldSlotProps}
                            onChange={(event) => 
                            {
                                const selectedIndex = field.dataType.findIndex( (item) => item[field.keyProperty as keyof DefinitionInterface ] === event.target.value);
                                onChange(event as ChangeEvent<HTMLInputElement>, selectedIndex);
                            }}
                        >
                            <MenuItem value="All" sx={{ height: "40px" }}>All</MenuItem>
                            {field.dataType.map((item, index) => 
                            (
                                <MenuItem key={index} value={item[field.keyProperty as keyof DefinitionInterface]}>
                                    {`${item[field.keyProperty as keyof DefinitionInterface]} (${item[field.descriptionProperty as keyof DefinitionInterface]})`}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Fragment>
                ))
            }
        </Fragment>
    )
}

export default DefinitionFieldSection;