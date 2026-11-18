"use client";
import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { BookDataBodyInterface } from "../../../../../../../Model/ModelForModal";

import ExpandableTypography from "../../../../../../../component/UIFragment/ExpandableTypography";
import { useAuthContext } from "../../../../../../../Context/User/AuthContext";
import { setDataTextColor } from "../../../../../../../Controller/SetTextController";

const BookDataBody:FC<BookDataBodyInterface> = (bookBodyData) => 
{
    const {isLoggedIn} = useAuthContext();
    const {BookData, status, descriptionData, recommendationReason} = bookBodyData;
      
    return(
            <Box sx={{ display: 'grid', gap: '20px 50px', width:'350px', gridTemplateColumns: '100%', paddingLeft: '10px'}}>
                {
                    Object.entries(BookData).map(([key, value], index) => 
                        (
                            <Typography key={index}>{value.label}: {value.value}</Typography>
                        )
                    )
                }
                
                {
                    isLoggedIn &&
                    <Box sx={{ width:'350px', display: 'inline-block'}}>
                        <Typography>Status:
                            <Box component={"span"} color={setDataTextColor(status, "OnShelf", "green", "red")}> {status}</Box>
                        </Typography>
                    </Box>
                }
                
                <ExpandableTypography title={"Description"}>{descriptionData}</ExpandableTypography>
                {recommendationReason && <ExpandableTypography title={"AI Recommendation"}>{recommendationReason}</ExpandableTypography>}
            </Box>
    );
}

export default BookDataBody