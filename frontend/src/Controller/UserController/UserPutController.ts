const contentType:string = 'application/json';
const localhost = process.env.REACT_APP_API_URL;

const url:string = `${localhost}/user`;

const fetchData = async (authToken:string, url: string, data: Record<string, any>) => 
{
    try 
    {
        const response = await fetch(url, 
        {
            method: 'PUT',
            headers: 
            { 
                'content-type': contentType, 
                'authToken': authToken
            },
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

const ModifyProfileDataController = async (authToken:string, option:string, body:any) => 
{
    const URL = `${url}/UserData/type=${option}`;
    const data: { username: string; password?: undefined;} | { password: string; username?: undefined;} = body; 
    return await fetchData(authToken, URL, data);
}

const ModifyUserDataController = async (authToken:string, userId: string, username:string, email:string, gender:string, role:string) => 
{
    const data = { username, email, gender, role };
    const URL = `${url}/UserData/id=${userId}`;
    return await fetchData(authToken, URL, data);
};

const ModifySuspendListDataController = async(authToken:string, userId:string, banListID:string, dueDate:Date, description:string) => 
{
    const data =  { banListID, dueDate, description };
    const URL = `${url}/SuspendListData/id=${userId}`;
    return await fetchData(authToken, URL, data);
}

const ModifyStatusController = async (type:string, authToken:string, userId: string, statusForUserList?: string, ListID?:string, startDate?: Date, dueDate?: Date, description?:string) => 
{
    const statusDataConfig =
    {
        Suspend: { banListID: ListID, statusForUserList, startDate, dueDate, description },
        UnSuspend: { statusForUserList, banListID: ListID }
    };

    const statusData = statusDataConfig[type as keyof typeof statusDataConfig];
        
    const URL = `${url}/Status/id=${userId}`;
    return await fetchData(authToken, URL, statusData) as Response;
};

export { ModifyUserDataController, ModifyProfileDataController, ModifySuspendListDataController, ModifyStatusController };
