import { Request, Response }  from 'express'
import { dashboardDataType, DashboardService } from "../service/dashboard/dashboardService";

export const GetDashboardData = async (req:Request, res:Response) => 
{
    const { type } = req.params;

    try
    {
        const {success, statusCode, message, data, insight} = await DashboardService(type as dashboardDataType);
        res.status(statusCode as number).json({success, message, data, insight: insight});
    }
    catch
    {
        return res.status(401).json({ success: false });
    }
}