// another file functions
import { connectToMongoDB } from './init/connectToMongo';
import { scheduleDailyMidnightTasks } from './utils/detectRecord';
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
    }
    catch(error)
    {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();

if(config.STORAGE_TYPE === 'LOCAL')
{
    scheduleDailyMidnightTasks();
}