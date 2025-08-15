import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const StockChart = ({ historicalData = [], predictions = [] }) => {
    if (!historicalData || historicalData.length < 7) {
        return <p className="text-center">Not enough data to display chart</p>;
    }
    console.log(predictions.predictions)
    const last7Days = historicalData.slice(-7);
    const lastDate = new Date(last7Days[last7Days.length - 1].date);
    const predictionData = predictions.map((pred, i) => {
        const date = new Date(lastDate);
        date.setDate(date.getDate() + (i + 1));
        return { date: date.toISOString().split("T")[0], predicted: pred };
    });

    const chartData = [
        ...last7Days.map(d => ({ date: d.date, actual: d.close })),
        ...predictionData
    ];

    return (
        <>
            <div className="flex align-center m-[30px] gap-[20px]">
                <div className="bg-[#e1e1e1] p-[20px] rounded-[10px] w-[60%]">
                    <h2 className="text-center">1 Year Historical Prices</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={historicalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis domain={["auto", "auto"]} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="close"
                                stroke="#007bff"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-[#e1e1e1] p-[20px] rounded-[10px] w-[40%]">
                    <h2 className="text-center">Stock Price (Last 7 Days & Predictions)</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis domain={["auto", "auto"]} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="actual"
                                stroke="#007bff"
                                strokeWidth={2}
                                dot={false}
                                name="Actual Price"
                            />
                            <Line
                                type="monotone"
                                dataKey="predicted"
                                stroke="#ff7300"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                name="Predicted Price"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
};

export default StockChart;
