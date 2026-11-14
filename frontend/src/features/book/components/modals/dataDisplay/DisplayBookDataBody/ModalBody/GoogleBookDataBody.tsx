"use client";
import { Box, Typography } from "@mui/material"
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

import { displayAsColumn, displayAsRow } from "../../../../../../../Data/Style"
import { FC } from "react"
import { GoogleBookDataInterface } from "../../../../../../../Model/ModelForModal";
import BarcodeField from "../../../../../../../component/UIFragment/BarcodeFIeld";

const GoogleBookDataBody:FC<GoogleBookDataInterface> = (GoogleBookDatabody) => 
{
    const {externalBookData, RatingAsNumber} = GoogleBookDatabody;

    const hasISBN = externalBookData.ISBN_13_Code !== "N/A" || externalBookData.ISBN_10_Code !== "N/A";

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

                { 
                    hasISBN &&
                    <Box sx={{ display: 'grid', gap: '20px', width: '350px', gridTemplateColumns: '100%' }}>

                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>ISBN Identifiers</Typography>
                        
                        <BarcodeField label={"ISBN-13"} value={externalBookData.ISBN_13_Code}/>
                        
                        <BarcodeField label={"ISBN-10"} value={externalBookData.ISBN_10_Code}/>
                    </Box>
                }
        </Box>
    )
}

export default GoogleBookDataBody