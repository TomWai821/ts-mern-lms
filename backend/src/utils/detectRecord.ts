import { detectExpiredLoanRecord, modifyFinesAmount } from "../schema/book/bookLoaned";
import { detectExpiredSuspendRecord } from "../schema/user/suspendList";

type Task = () => Promise<void>;

const taskList: Task[] =
[
    detectExpiredSuspendRecord,
    modifyFinesAmount,
    detectExpiredLoanRecord
]

const executeAllTasks = async () => 
{
    try 
    {
        console.log(`[${new Date().toISOString()}] Executing scheduled tasks...`);

        const results = await Promise.allSettled(taskList.map(task => task()));
        

        results.forEach((result, index) => 
        {
            if (result.status === 'rejected') 
            {
                console.error(`Task ${index} failed:`, result.reason);
            }
        });
    } 
    catch (error) 
    {
        console.error("Critical error during task execution:", error);
    }
};

export const scheduleDailyMidnightTasks = async () => 
{
    // Event-driven Boot-up Sync: Avoid the task does not implement when the server sleep
    await executeAllTasks();

    const now = new Date();

    const UTCYear = now.getUTCFullYear();
    const UTCMonth = now.getUTCMonth();
    const getDate = now.getUTCDate();

    const nextMidnight_UTC8 = new Date(UTCYear, UTCMonth, getDate + 1, 0, 0, 0, 0);
    nextMidnight_UTC8.setHours(nextMidnight_UTC8.getUTCHours() + 8);

    const delay = nextMidnight_UTC8.getTime() - now.getTime();

    setTimeout( async () => 
    {
        await executeAllTasks();

        // Run at fixed interval (every 24h)
        setInterval(executeAllTasks, 24 * 60 * 60 * 1000);
    }, delay);
};

export const dailyCronHandler = async (event: any, context: any) => 
{
    try 
    {
        await executeAllTasks();
        return { statusCode: 200, body: "AWS EventBridge Tasks completed" };
    } 
    catch (error) 
    {
        console.error("Critical error in Lambda cron:", error);
        return { statusCode: 500, body: "Internal server error" };
    }
};
