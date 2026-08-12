import { FC } from "react";
import { Box } from "@mui/material";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import type { ChartOptions } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface IFinesDataPieChart
{
    ReturnBook: number 
    NotReturnBook: number;
}

const FinesNotPaidDataPieChart:FC<IFinesDataPieChart> = (props) =>
{
    const { ReturnBook, NotReturnBook } = props;

    const data = 
    {
        labels: ["Return Book", "Not Return Book"],
        datasets: 
        [
            {
                data: [ReturnBook, NotReturnBook],
                backgroundColor: ["#4CAF50", "#FF6384"],
                hoverBackgroundColor: ["#4CAF50", "#FF6384"],
            }
        ]
    };

    const options: ChartOptions<"pie"> = 
    {
        responsive: true,
        maintainAspectRatio: false,
        plugins: 
        {
            title: 
            { 
                display: true, text: "Fines Not Paid Status",
                font: { size: 18, weight: "bold" },
                padding: { top: 10, bottom: 20 }
            },
            tooltip: 
            {
                callbacks: 
                {
                    label: (context) => 
                    {
                        const dataset = context.dataset.data as number[];
                        const total = dataset.reduce((acc, val) => acc + val, 0);
                        const value = context.raw as number;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value} (${percentage}%)`;
                    }
                }
            },
            legend: 
            {
                labels: 
                {
                    generateLabels: (chart) => 
                    {
                        const data = chart.data;
                        if (data.labels && data.datasets.length) 
                        {
                            const dataset = data.datasets[0];

                            return data.labels.map((label, i) => 
                            {
                                const value = dataset.data[i] as number;
                                
                                return {
                                    text: `${label} - HKD$${value}`, 
                                    fillStyle: Array.isArray(dataset.backgroundColor)
                                        ? dataset.backgroundColor[i] as string
                                        : (dataset.backgroundColor as string) || "#ccc",
                                    index: i
                                };
                            });
                        }
                        return [];
                    }
                }
                },
        }
    }

    return (
        <Box sx={{ width: "500px", height: "500px" }}>
            <Pie data={data} options={options}/>
        </Box>
    )
};

export default FinesNotPaidDataPieChart;
