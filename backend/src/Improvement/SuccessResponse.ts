type successCode = '0000' | '0001' | '0002';

const successCodeList: Record<successCode, string> =
{
    '0000': "Authentication successful!",
    '0001': "No error, The request was successful",
    '0002': "No error, but there is no data to return"
}

export const successResponse = <T>(successCode: successCode, message: string, data?: [T], totalRecord?: number) => 
{
    if(successCode === '0000')
    {
        console.log(`Invalid success code: ${successCode} - ${message}`);
        return;
    }

    const responseData = { totalRecord: totalRecord !== undefined ? totalRecord : (data ? (Array.isArray(data) ? data.length : 1) : 0), data }

    return { success: true, errorCode: successCode, errorMessage: successCodeList[successCode], message, ...responseData };
}

export const successAuthenicationResponse = (message: string) => 
{
    return { success: true, errorCode: '0000', errorMessage: successCodeList['0000'], message };
}
