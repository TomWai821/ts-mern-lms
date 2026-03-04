import mongoose from "mongoose";
import { SuspendListInterface } from "../../model/userSchemaInterface";
import { printError } from "../../controller/Utils";
import { FindUserByIDAndUpdate } from "./user";
import { suspendListStatus } from "../../data/enums";

const SuspendListSchema = new mongoose.Schema<SuspendListInterface>
(
    {
        userID: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
        description: { type: String, default: "N/A" },
        status: { type: String, default: 'Suspend', enum: suspendListStatus},
        startDate: { type: Date, required: true, immutable: true },
        dueDate: { type: Date },
        unSuspendDate: { type: Date, default: null }
    }
)

const SuspendList = mongoose.model<SuspendListInterface>('SuspendList', SuspendListSchema);

export const CreateSuspendList = async (data: Record<string, any>) =>
{
    try 
    {
        const banList = await SuspendList.create(data);
        return banList;
    } 
    catch (error) 
    {
        printError(error);
    }
}

export const GetSuspendList = async (data?: Record<string, any>) =>
{
    try 
    {
        if (typeof data === "string") 
        {
            return await SuspendList.find({});
        }
        return await SuspendList.find(data as Record<string, any>);
    }  
    catch (error) 
    {
        printError(error);
    }
}

export const GetSuspendListCount = async (roleID?: string) => 
{
    if(roleID)
    {
        return await SuspendList.countDocuments({ where: { role: roleID }});
    }
    return await SuspendList.countDocuments();
}

export const FindSuspendList = async (data: Record<string, any>) =>
{
    try 
    {
        return await SuspendList.findOne(data);
    } 
    catch (error) 
    {
        printError(error);
    }
}

export const FindSuspendListByID = async (suspendListID: string, select?: Record<string, any>) =>
{
    try 
    {
        if (select) 
        {
            return await SuspendList.findById(suspendListID).select(select);
        }
        return await SuspendList.findById(suspendListID);
    } 
    catch (error) 
    {
        printError(error);
    }
}

export const FindSuspendListByIDAndUpdate = async (suspendListID: string, data: Record<string, any>) =>
{
    try 
    {
        return await SuspendList.findByIdAndUpdate(suspendListID, data, { new: true });
    } 
    catch (error) 
    {
        printError(error);
    }
}

export const detectExpiredSuspendRecord = async () => 
{
    try
    {
        const currentDate = new Date();

        const expiresRecord = await GetSuspendList({dueDate: {$lt: currentDate}}) as SuspendListInterface[];

        if(expiresRecord.length > 0)
        {
            console.log(`Auto-Unsuspend ${expiresRecord.length} users`);

            for(const record of expiresRecord)
            {
                const modifyUserStatus = await FindUserByIDAndUpdate(record.userID as unknown as string, {status: 'Normal'});

                if(!modifyUserStatus)
                {
                    console.log(`Failed to Change ${record.userID} status`);
                    continue;
                }

                const modifySuspendStatus = await FindSuspendListByIDAndUpdate(record._id as unknown as string, {status: 'Unsuspend', unSuspendDate: currentDate});
            
                if(!modifySuspendStatus)
                {
                    console.log(`Failed to Unsuspend ${record._id}`);
                    continue;
                }

                console.log(`Unsuspend user ${record.userID} successfully!`);
            }
        }
    }
    catch(error)
    {
        console.error("Error detecting expired suspensions:", error);
    }
}