export const printError = async (error:any) => 
{
    if (error instanceof Error) 
    {
        throw new Error(error.message);
    } 
    else 
    {
        throw new Error('An unknown error occurred');
    }
}

export const lookupAndUnwind = (from:string, localField:string, foreignField:string, asField:string) => 
(
    [
        { $lookup: { from, localField, foreignField, as: asField } },
        { $unwind: { path: `$${asField}`, preserveNullAndEmptyArrays: true } }
    ]
);

export const setToMidnight = (date: Date) => 
{
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);
    return today;
};