import { useState } from "react"

type ConfigDataType = 'tabValue' | 'page' | 'paginationValue';

export const usePageConfigData = (data: any) => 
{
    const [tabValue, setTabValue] = useState<number>(0);
    const [page, setPage] = useState<number[]>([1, 1]);
    const [paginationValue, setPaginationValue] = useState<number[]>([10, 10]);

    const setPageConfigData = (name: ConfigDataType, newValue: number): void => 
    {
        const configDataSetter: Record<ConfigDataType, () => void> = 
        {
            'tabValue': () => setTabValue(newValue),
            'page': () => setPage(prev => 
            {
                const updated = [...prev];
                updated[tabValue] = newValue;
                return updated
            }),
            'paginationValue': () => setPaginationValue(prev => 
            {
                const updated = [...prev];
                updated[tabValue] = newValue;
                return updated
            })
        }
        
        return configDataSetter[name]();
    }

    const getPageConfigData = (name: ConfigDataType): number => 
    {
        const configData: Record<ConfigDataType, number> = 
        {
            'tabValue': tabValue,
            'page': page[tabValue],
            'paginationValue': paginationValue[tabValue]
        }

        return configData[name];
    }

    const getPageCountAndData = (): {total:number, countPage: number, paginatedData: any[]} => 
    {
        const total = data[tabValue].length;
        const startIndex = (page[tabValue] - 1) * paginationValue[tabValue];
        const endIndex = startIndex + paginationValue[tabValue];

        const paginatedData = data[tabValue].slice(startIndex, endIndex);
        const countPage = Math.ceil(data.length / paginationValue[tabValue]);

        return {total, countPage, paginatedData};
    }

    return {setPageConfigData, getPageConfigData, getPageCountAndData};
}