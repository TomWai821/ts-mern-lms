// another file functions
import { connectToMongoDB } from './init/connectToMongo';
import { dailyCronHandler, scheduleDailyMidnightTasks } from './utils/detectRecord';
import { config } from './config/config';
import app from './app'

export const startServer = async () =>
{
    const PORT = config.PORT as number;

    try
    {  
        await connectToMongoDB();

        app.listen(PORT, () => 
        { 
            console.log(`Server listen to http://localhost:${PORT}`);
        });

        switch (config.STORAGE_TYPE)
        {
            case 'LOCAL':
                console.log('Storge environment is local, launch local detector...');
                scheduleDailyMidnightTasks();
                break;

            case 'S3':
                console.log('Storage environment is S3, AWS EventBridge handle the cron job...');
                break;

            default:
                console.warn('No valid STORAGE_TYPE specified. Scheduled tasks will not run.');
                break;
        }
    }
    catch(error)
    {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();