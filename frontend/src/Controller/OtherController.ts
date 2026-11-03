const MillionSecondsToDay = 1000 * 60 * 60 * 24;

export const ChangePage = (location: string) => 
{
    window.location.href = location;
}

export const GetCurrentDate = (type:string): Date | string => 
{ 
    const date = new Date();

    switch(type)
    {
        case "String":
            return date.toISOString().split('T')[0] as string; 

        case "Date":
            return date as Date;
        
        default:
            return `Invalid type: ${type}`;
    }
}

export const CalculateDueDate = (duration:number): Date => 
{
    const currentDate = new Date();
    let dueDate = new Date(currentDate);
    dueDate.setDate(currentDate.getDate() + duration);

    return dueDate;
}

export const TransferDateToISOString = (date: Date | string): string => 
{
    if (date instanceof Date) 
    {
        return date.toISOString().split("T")[0];
    }

    const parsedDate = new Date(date);
    
    if (!isNaN(parsedDate.getTime())) 
    {
        return parsedDate.toISOString().split("T")[0];
    }

    return "Invalid Date";
};

export const TransferDateToString = (date: Date | undefined):string => 
{
    if (!date) return "N/A";
    return new Date(date).toISOString().split("T")[0];
}

export const CalculateSuspendDuration = (startDate:Date, dueDate: Date | string) => 
{
    const start = new Date(startDate);
    const end = new Date(dueDate);

    const durationInMilliseconds = end.getTime() - start.getTime();
    const days = Math.floor(durationInMilliseconds / MillionSecondsToDay);

    return days.toLocaleString('en-US') + " Days";
}

export const getRemainingSuspensionDays = (dueDate: Date | string) => 
{
    if (dueDate === "N/A") 
    {
        return "N/A";
    }

    const currentDate = new Date();
    const end = new Date(dueDate);

    const durationInMilliseconds = end.getTime() - currentDate.getTime();

    const days = Math.ceil(durationInMilliseconds / MillionSecondsToDay);

    if (days <= 0) 
    {
        return "Ready for Unsuspension";
    }

    return `${days.toLocaleString("en-US")} ${ days === 1 ? "Day" : "Days"} Left`;
};

export const getOverdueDays = (dueDate: Date | string, returnDate?: Date | string): number => 
{
    const due = new Date(dueDate);
    due.setHours(0,0,0,0);

    const compareDate = returnDate ? new Date(returnDate): new Date();
    compareDate.setHours(0,0,0,0);

    const diffDays = Math.floor((compareDate.getTime() - due.getTime()) / MillionSecondsToDay);

    return Math.max(0, diffDays);
};

/*
export const maskedData = (type:string, data:string) => 
{
    switch(type)
    {
        case "email":
            let [localPart, domain] = data.split("@");
            let hashedLocal = localPart.split("").map((char, i) => (i < 3 ? char : "*")).join("");
            return data === "N/A" ? data : `${hashedLocal}@${domain}`;

        case "phoneNumber":
            return data.split("").map((char, i) => (i < 2 ? char: "*")).join("");

        case "password":
            return data.split("").map((char) => (char = "*"));
        
        default:
            console.log(`Invalid Type: ${type}!`);
            break;
    }
}
*/