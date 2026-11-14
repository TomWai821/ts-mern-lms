import { FC, Fragment } from "react"

import { Avatar, Box, Typography } from "@mui/material";
import ExpandableTypography from "../../../../../../component/UIFragment/ExpandableTypography";
import { useAuthContext } from "../../../../../../Context/User/AuthContext";
import { TransferDateToString, CalculateSuspendDuration, getRemainingSuspensionDays } from "../../../../../../Controller/OtherController";
import { setDataTextColor } from "../../../../../../Controller/SetTextController";
import { displayAsColumn } from "../../../../../../Data/Style";
import { DisplayDataModalBody } from "../../../../../../Model/ModelForModal";
import { UserResultDataInterface } from "../../../../../../Model/ResultModel";


const SuspendedUserDataBody:FC<DisplayDataModalBody> = (SuspendedUserData) => 
{
    const {data} = SuspendedUserData;
    const {isAdmin} = useAuthContext();
    const Data = data as UserResultDataInterface;

    return(
        <Box sx={{...displayAsColumn, alignItems:'center', justifyContent: 'center'}}>
            <Avatar src={Data.avatarUrl ?? "/broken-image.jpg"} sx={{ width: "100px", height: "100px" }} />
            <Typography sx={{fontSize: '24px', padding: '15px'}}>{Data.role}</Typography>
            <Box sx={{ display: 'grid', gap: '20px 50px', gridTemplateColumns: '100%'}}>
                <Typography>Username: {Data.username}</Typography>
                {
                    isAdmin && 
                    (
                        <Fragment>
                                <Typography>Gender: {Data.gender}</Typography>
                                <Typography>
                                    Status: <Box component={"span"} color={setDataTextColor(Data.suspendedDetails?.status as string, "Unsuspend", "green", "red")}> {Data.suspendedDetails?.status} </Box> 
                                    {Data.suspendedDetails?.status === "Unsuspend" && `(Unsuspend At ${TransferDateToString(Data.suspendedDetails?.unSuspendDate as Date)})` }
                                </Typography>
                        </Fragment>
                    )
                }
                <Typography>Date: { !Data.suspendedDetails?.dueDate || new Date(Data.suspendedDetails?.dueDate).getTime() <= 0 ? "N/A" 
                    : `${TransferDateToString(Data.suspendedDetails?.startDate as Date)} - ${TransferDateToString(Data.suspendedDetails?.dueDate as Date)}` }
                </Typography>

                <Typography>Duration: { CalculateSuspendDuration(Data.suspendedDetails?.startDate as Date, Data.suspendedDetails?.dueDate as Date) }
                { 
                    isAdmin && Data.suspendedDetails?.status === "Suspend" && Data.suspendedDetails?.dueDate && new Date(Data.suspendedDetails?.dueDate).getTime() > 0 && 
                    (
                        <Fragment> ({getRemainingSuspensionDays(Data.suspendedDetails?.dueDate as Date)}) </Fragment>
                    )
                }
                </Typography>

                <ExpandableTypography title={"Description"}> {Data.suspendedDetails?.description}</ExpandableTypography>
            </Box>
        </Box>
    );
}

export default SuspendedUserDataBody