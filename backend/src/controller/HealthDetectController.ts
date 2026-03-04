import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const APIHealthDetect = (req: Request, res: Response) => {
    try 
    {
        const state = mongoose.connection.readyState; // 1 = connected
        
        res.status(200).json({status: state === 1 ? 'ok' : 'not connected', timestamp: new Date()});
    } 
    catch (error) 
    {
        if (error instanceof Error) 
        {
            res.status(500).json({ status: 'error', error: error.message });
        } 
        else 
        {
            res.status(500).json({ status: 'error', error: String(error) });
        }
    }
};
