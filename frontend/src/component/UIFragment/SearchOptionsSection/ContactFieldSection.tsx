import { ChangeEvent, FC, Fragment } from "react";
import { ContactInterface } from "../../../Model/ResultModel";
import { Typography, TextField, MenuItem } from "@mui/material";

interface ContactFieldSectionProps
{
    contactFields: ContactFields[];
    onChange: (event: ChangeEvent<HTMLInputElement>, selectedIndex: number) => void;
}

interface ContactFields
{
    title: string;
    name: string;
    value: string;
    dataType: ContactInterface[];
    keyProperty: string;
}

const optionFieldSlotProps = {select: { MenuProps: {PaperProps: { style: { maxHeight: 300 }}}}}

const ContactFieldSection:FC<ContactFieldSectionProps> = (props) => 
{
    const { contactFields, onChange } = props;

    return(
        <Fragment>
            {
                contactFields.map((field, index) => 
                (
                    <Fragment key={index}>
                        <Typography>{field.title}</Typography>
                        <TextField name={field.name} value={field.value} size="small" select  slotProps={optionFieldSlotProps}
                            onChange={(event) => 
                            {
                                const selectedIndex = field.dataType.findIndex( (item) => item[field.keyProperty as keyof ContactInterface] === event.target.value);
                                onChange(event as ChangeEvent<HTMLInputElement>, selectedIndex);
                            }}
                        >
                            <MenuItem value="All" sx={{ height: "40px" }}>All</MenuItem>
                            {field.dataType.map((item, index) => 
                            (
                                <MenuItem key={index} value={item[field.keyProperty as keyof ContactInterface]}>
                                    {item[field.keyProperty as keyof ContactInterface]}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Fragment>
                ))
            }
        </Fragment>
    )
}

export default ContactFieldSection;