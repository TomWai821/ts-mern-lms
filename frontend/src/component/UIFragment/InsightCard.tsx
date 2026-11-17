import { LightbulbOutlined } from "@mui/icons-material";
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { FC } from "react";
import { displayAsColumn } from "../../Data/Style";

interface InsightCardProps
{
    content: string[]
}

const InsightCard:FC<InsightCardProps> = (props) => 
{
    const {content} = props;

    return(
        <Box sx={{...displayAsColumn, paddingTop: "20px"}}>
            <Typography sx={{fontSize: '24px'}}>Dashboard Insight</Typography>
            <List dense>
            {
                content.length > 1 ?
                content.map((item, index) =>
                    <ListItem key={index}>
                        <ListItemIcon>
                            <LightbulbOutlined color="warning" />
                        </ListItemIcon>

                        <ListItemText primary={item}/>
                    </ListItem>
                )
                :
                <ListItem>
                    <ListItemIcon>
                        <LightbulbOutlined color="warning" />
                    </ListItemIcon>

                    <ListItemText primary={content}/>
                </ListItem>
            }
            </List>
        </Box>
    );
}

export default InsightCard