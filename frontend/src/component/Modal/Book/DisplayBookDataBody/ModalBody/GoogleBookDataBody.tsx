import { Fragment } from "react/jsx-runtime"
import Barcode from "react-barcode"

import { Box, Typography } from "@mui/material"
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

import { displayAsColumn, displayAsRow } from "../../../../../Data/Style"
import { FC } from "react"
import { GoogleBookDataInterface } from "../../../../../Model/ModelForModal";

const GoogleBookDataBody:FC<GoogleBookDataInterface> = (GoogleBookDatabody) => 
{
    const {externalBookData, RatingAsNumber} = GoogleBookDatabody;

    return(
        <Box sx={{ display: 'grid', gap: '20px 50px', width:'350px', gridTemplateColumns: '100%', paddingLeft: '10px'}}>
                <Box sx={displayAsColumn}>
                    <Typography>Average Rating: {externalBookData.averageRating}</Typography>
                    <Box sx={displayAsRow}>
                        {
                            externalBookData.averageRating !== "N/A" && 
                            Array.from({ length: 5 }).map((_, index) => 
                            (
                                index < RatingAsNumber ? <StarIcon key={index} sx={{color: 'gold'}}/> : <StarBorderIcon key={index} />
                            )) 
                        }
                    </Box>
                </Box>

                <Typography>Rating Count: {externalBookData.ratingsCount}</Typography>
                <Typography>Categories: {externalBookData.categories}</Typography>
                <Typography>List Price: {externalBookData.listPrice}</Typography>
                <Typography>Retail Price: {externalBookData.retailPrice} (From Google Books)</Typography>
                <Box sx={{ display: 'grid', gap: '20px', width: '350px', gridTemplateColumns: '100%' }}>
                    <Typography sx={{fontSize: '24px', fontWeight: 'bold'}}>ISBNs:</Typography>
                    {
                        externalBookData.ISBN_13_Code !== "N/A" ?
                        <Fragment>
                            <Typography>ISBN-13:</Typography>
                            <Box>
                                <Barcode value={externalBookData.ISBN_13_Code} width={2} height={60}/>
                            </Box>
                        </Fragment>
                        :
                        <Typography>ISBN-13: N/A</Typography>
                    }
                    
                    {
                        externalBookData.ISBN_10_Code !== "N/A" ?
                        <Fragment>
                            <Typography>ISBN-10:</Typography>
                            <Box>
                                <Barcode value={externalBookData.ISBN_10_Code} width={2} height={60}/>
                            </Box>
                        </Fragment>
                        :
                        <Typography>ISBN-10: N/A</Typography>
                    }
                </Box>
        </Box>
    )
}

export default GoogleBookDataBody