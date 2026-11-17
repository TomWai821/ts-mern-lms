import { LightbulbOutlined } from "@mui/icons-material";
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { FC } from "react";

interface InsightCardProps
{
    content: string[]
}

const InsightCard:FC<InsightCardProps> = (props) => 
{
    const {content} = props;

    return(
        <Box>
            <Typography>Dashboard Insight</Typography>
            <List dense>
            {
                content.map((item, index) =>
                    <ListItem key={index}>
                        <ListItemIcon>
                            <LightbulbOutlined color="warning" />
                        </ListItemIcon>

                        <ListItemText
                            primary={item}
                        />
                    </ListItem>
                )
            }
            </List>
        </Box>
    );
}

export default InsightCard