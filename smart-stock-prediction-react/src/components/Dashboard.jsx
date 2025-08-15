import React from "react";


function Dashboard({ predictionData }) {
    // if (!predictionData || Object.keys(predictionData).length === 0) {
    //     return <p className="text-center text-gray-500">No prediction data yet.</p>;
    // }

    return (
        <>
            <div className="mx-[30px] flex text-[whitesmoke] grid-cols-1 md:grid-cols-3 gap-[20px]">
                {/* ML Prediction Card */}
                <div className="rounded-[10px] w-[33%] p-[30px] border-none" style={{
                    backgroundImage:
                        "linear-gradient(to left top, #001b44, #002d6f, #003f9d, #0051cd, #0064ff)"
                }}>
                    <h2 className="mb-[5px]">ML Prediction</h2>
                    <p className="text-lg">
                        <strong>Trend:</strong>{" "}
                        <span>
                            {predictionData.trend}
                        </span>
                    </p>
                </div>

                {/* AI Analysis Card */}
                <div className="bg-[#007e6a] w-[33%] rounded-[10px] p-[30px] border-none" style={{
                    backgroundImage:
                        "linear-gradient(to left top, #004238, #005e50, #007b69, #009982, #00b99d)"
                }}>
                    <h2 className="mb-[3px]">AI Analysis</h2>
                    <p>
                        <strong>Overall Sentiment:</strong>{" "}
                        <span>
                            {predictionData.insights?.overall_sentiment}
                        </span>
                    </p>
                </div>

                {/* Final Recommendation Card */}
                <div className="bg-[#9d0000] w-[33%] rounded-[10px] p-[30px] border-none" style={{
                    backgroundImage:
                        "linear-gradient(to left top, #660000, #820004, #9e0006, #bc0004, #da0000)"
                }}>
                    <h2 className="mb-[3px]">Final Recommendation</h2>
                    <p>
                        <strong>Decision:</strong>{" "}
                        <span>{predictionData.decision}</span>
                    </p>
                </div>
            </div >
            <div className="bg-[#9d0000] rounded-[10px] p-[30px] border-none text-[whitesmoke] mx-[30px] my-[20px]" style={{
                backgroundImage:
                    "linear-gradient(to left top, #023d19, #005d26, #008034, #00a441, #00c94e)"
            }}>
                <h2 className="mb-[3px]">Summary</h2>
                <p className="mb-3 leading-[20px]">
                    {predictionData.insights?.summary}
                </p>
            </div>
        </>
    );
}

export default Dashboard;
