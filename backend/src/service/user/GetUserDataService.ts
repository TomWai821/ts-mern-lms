import { FindUserByID, FindUserWithData, GetUser } from "../../schema/user/user";

export const GetUserDataService = async (userId: string, tableName: string[] | string, queryParams: any) => 
{    
    let foundUserData: any = null;

    if (userId) 
    {
        const hasBodyParameter = Object.keys(queryParams).length > 0;
        foundUserData = (!hasBodyParameter && !tableName)? await FindUserByID(userId as unknown as string) : await fetchUserData(tableName as string, queryParams, userId as unknown as string);
    } 
    else 
    {
        foundUserData = await GetUser();
    }

    if (!foundUserData) 
    {
        return {success: false, statusCode: 404, message: "User information not found"}
    }

    const foundUser = foundUserData;
    return {success: true, statusCode: 200, foundUser};
};

const fetchUserData = async (tableName: string, queryParams: any, userId?: string) => 
{
    const query = buildQuery(queryParams);
    return await FindUserWithData(tableName, query, userId);
};

const buildQuery = (queryParams: any) => 
{
    const { username, status, role, gender } = queryParams;

    return {
        ...(username && { "username": { $regex: username, $options: "i" } }),
        ...(status && { status }),
        ...(role && { role }),
        ...(gender && { gender })
    };
};