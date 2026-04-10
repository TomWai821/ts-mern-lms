import { Request, Response } from 'express';
import { executeAllTasks } from '../utils/detectRecord';

export const AWSTaskDetect = async (req: Request, res: Response) => 
{
    if (req.body.source === 'eventbridge.scheduler' && req.body.task === 'daily-midnight-job') 
    {
        console.log('EventBridge schedule triggered, starting dailyCronHandler...');
        
        try 
        {
            await executeAllTasks();
            return res.status(200).json({ message: "AWS EventBridge Tasks completed successfully" });
        } 
        catch (error) 
        {
            console.error("Cron task failed:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    
    res.status(404).send('Not Found');
}