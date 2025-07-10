import { detectExpiredLoanRecord, modifyFinesAmount } from "./schema/book/bookLoaned";
import { detectExpiredSuspendRecord } from "./schema/user/suspendList";

export const detectRecordsDaily = () => 
{
    const DayToMillionSeconds = 24 * 60 * 60 * 1000;
    setInterval(detectExpiredSuspendRecord, DayToMillionSeconds);
    setInterval(modifyFinesAmount, DayToMillionSeconds);
    setInterval(detectExpiredLoanRecord, DayToMillionSeconds);
}