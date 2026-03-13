export const SetUserCookie = (authToken: string, username: string, role: string, avatarUrl: string, status: string, days: number, expires?: string) => 
{
    if (!expires) 
    {
        if (days) 
        {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = date.toUTCString();
        }
    }
    const userInfo = { authToken, username, role, avatarUrl, status };
    document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(userInfo))}; expires=${expires}; path=/; SameSite=Lax; Secure`;
};

export const GetUserCookie = (data: string): string | null => 
{
    if(document.cookie.length > 0) 
    {
        const userInfo = decodeURIComponent(document.cookie.split("userInfo=")[1]);
        const userData = JSON.parse(userInfo);
        return userData[data];
    }

    return null;
};