import { FC, Fragment } from "react"
import { DisplayDataModalBody } from "../../../../Model/ModelForModal";
import { Avatar, Box, Typography } from "@mui/material";
import { CalculateDuration, CountDuration, TransferDateToString } from "../../../../Controller/OtherController";
import { UserResultDataInterface } from "../../../../Model/ResultModel";
import { displayAsColumn } from "../../../../Data/Style";
import { useAuthContext } from "../../../../Context/User/AuthContext";
import ExpandableTypography from "../../../UIFragment/ExpandableTypography";
import { setDataTextColor } from "../../../../Controller/SetTextController";

const BannedUserDataBody:FC<DisplayDataModalBody> = (BannedUserData) => 
{
    const {data} = BannedUserData;
    const {IsAdmin} = useAuthContext();
    const Data = data as UserResultDataInterface;

    return(
        <Box sx={{...displayAsColumn, alignItems:'center', justifyContent: 'center'}}>
            <Avatar src={Data.avatarUrl ?? "/broken-image.jpg"} sx={{ width: "100px", height: "100px" }} />
            <Typography sx={{fontSize: '24px', padding: '15px'}}>{Data.role}</Typography>
            <Box sx={{ display: 'grid', gap: '20px 50px', gridTemplateColumns: '100%'}}>
                <Typography>Username: {Data.username}</Typography>
                {
                    IsAdmin() && 
                    (
                        <Fragment>
                                <Typography>Gender: {Data.gender}</Typography>
                                <Typography>
                                    Status: <Box component={"span"} color={setDataTextColor(Data.suspendedDetails?.status as string, "Unsuspend", "green", "red")}> {Data.suspendedDetails?.status} </Box> 
                                    {Data.suspendedDetails?.status === "Unsuspend" && `(Unsuspend At: ${TransferDateToString(Data.suspendedDetails?.unSuspendDate as Date)})` }
                                </Typography>
                        </Fragment>
                    )
                }
                <Typography>Date: { !Data.suspendedDetails?.dueDate || new Date(Data.suspendedDetails?.dueDate).getTime() <= 0 ? "N/A" 
                    : `${TransferDateToString(Data.suspendedDetails?.startDate as Date)} - ${TransferDateToString(Data.suspendedDetails?.dueDate as Date)}` }
                </Typography>

                <Typography>Duration: { CalculateDuration(Data.suspendedDetails?.startDate as Date, Data.suspendedDetails?.dueDate as Date) }
                { 
                    IsAdmin() && Data.suspendedDetails?.status === "Suspend" && Data.suspendedDetails?.dueDate && new Date(Data.suspendedDetails?.dueDate).getTime() > 0 && 
                    (
                        <Fragment> ({CountDuration(Data.suspendedDetails?.dueDate as Date)} Days Left) </Fragment>
                    )
                }
                </Typography>

                <ExpandableTypography title={"Description"}> {Data.suspendedDetails?.description}</ExpandableTypography>
            </Box>
        </Box>
    );
}

export default BannedUserDataBody