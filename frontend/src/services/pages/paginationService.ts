import { useState } from "react";

export const usePaginationService = <T extends unknown>(data: T[] = [], paginationValue: number) => 
{
    const [page, setPage] = useState<number>(1);

    const startIndex = (page - 1) * paginationValue;
    const endIndex = startIndex + paginationValue;

    const paginatedData = data.slice(startIndex, endIndex);
    const count = Math.ceil((data?.length || 0) / paginationValue);

    const getCountPage = () : void | number => 
    {
        return count;
    }

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => 
    {
        setPage(newPage);
    };

    useState(() => 
    {
        getCountPage();
    })

    return { paginatedData, getCountPage, handlePageChange, page };
}