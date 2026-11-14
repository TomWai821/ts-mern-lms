const contentType:string = 'application/json';
const localhost = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const url:string = `${localhost}/api/user`;

const fetchData = async (url: string, data: Record<string, any>) => 
{
    try 
    {
        const response = await fetch(url, 
        {
            method: 'PUT',
            credentials:"include",
            headers: { 'content-type': contentType },
            body: JSON.stringify(data)
        });

        return response;
    } 
    catch (error) 
    {
        console.log(error);
        throw error;
    }
};

const ModifyProfileDataController = async (option:string, body:any) => 
{
    const URL = `${url}/UserData/type=${option}`;
    const data: { username: string; password?: undefined;} | { password: string; username?: undefined;} = body; 
    return await fetchData(URL, data);
}

const ModifyUserDataController = async (userId: string, username:string, email:string, gender:string, role:string) => 
{
    const data = { username, email, gender, role };
    const URL = `${url}/UserData/id=${userId}`;
    return await fetchData(URL, data);
};

const ModifySuspendListDataController = async(userId:string, suspendListID:string, dueDate:Date, description:string) => 
{
    const data =  { suspendListID, dueDate, description };
    const URL = `${url}/SuspendListData/id=${userId}`;
    return await fetchData(URL, data);
}

const ModifyStatusController = async (type:string, userId: string, statusForUserList?: string, ListID?:string, startDate?: Date, dueDate?: Date, description?:string) => 
{
    const statusDataConfig =
    {
        Suspend: { suspendListID: ListID, statusForUserList, startDate, dueDate, description },
        UnSuspend: { statusForUserList, suspendListID: ListID }
    };

    const statusData = statusDataConfig[type as keyof typeof statusDataConfig];
        
    const URL = `${url}/${type}/id=${userId}`;
    return await fetchData(URL, statusData) as Response;
};

export { ModifyUserDataController, ModifyProfileDataController, ModifySuspendListDataController, ModifyStatusController };
