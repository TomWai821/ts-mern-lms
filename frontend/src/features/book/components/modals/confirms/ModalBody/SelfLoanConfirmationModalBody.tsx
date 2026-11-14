import { Avatar, Box, Typography } from "@mui/material"
import { BookImageFormat, displayAsColumn, displayAsRow } from "../../../../../../Data/Style"
import { FC } from "react"
import { LoanBookModalInterface } from "../../../../../../Model/ModelForModal"
import ExpandableTypography from "../../../../../../component/UIFragment/ExpandableTypography"

const SelfLoanConfirmationModalBody:FC<LoanBookModalInterface> = (SelfLoanBookData) => 
{
    const {bookname, author, language, genre, description, imageUrl} = SelfLoanBookData;

    const bookData = 
    [
        {label: "Bookname", value: bookname},
        {label: "Author", value: author},
        {label: "Language", value: language},
        {label: "Genre", value: genre}
    ]

    return(
        <Box sx={displayAsRow}>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <Avatar src={imageUrl} alt="Preview" variant="rounded" sx={BookImageFormat}/>
            </Box>

            <Box sx={{...displayAsColumn, margin: '10px 0 0 20px', gap:"20px 50px"}}>
                {
                    bookData.map((data, index) => 
                        (
                            <Typography key={index}>{data.label}: {data.value}</Typography>
                        )
                    )
                }
                <ExpandableTypography title={"Description"}>{description}</ExpandableTypography>
            </Box>
        </Box>
    )
}

export default SelfLoanConfirmationModalBody