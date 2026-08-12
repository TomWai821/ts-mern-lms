import { Card, Typography } from "@mui/material";
import { FC } from "react";

interface IDashboardCard
{
    title: string;
    recordAmount: number;
}

const dashboardCardSyntax = {width: "350px", height: "100px", padding: "10px 10px"};

const DashboardCard:FC<IDashboardCard> = (props) => 
{
    const {title, recordAmount} = props;

    return(
        <Card sx={dashboardCardSyntax}>
            <Typography sx={{fontSize: "36px"}}>{recordAmount}</Typography>
            <Typography sx={{fontSize: "20px"}}>{title}</Typography>
        </Card>
    );
}

export default DashboardCard