import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onPredict }) => {
    const [selectedStock, setSelectedStock] = useState("");
    const [pdfFile, setPdfFile] = useState(null);
    const [isLoader, setIsLoader] = useState(false);

    const handlePDFChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
        } else {
            alert("Please upload a valid PDF file.");
        }
    };

    const handlePredict = async () => {
        if (!selectedStock) {
            alert("Please select a stock first.");
            return;
        }

        try {
            setIsLoader(true);

            const formData = new FormData();
            formData.append("symbol", selectedStock);
            if (pdfFile) {
                formData.append("pdf", pdfFile);
            }

            const response = await axios.post(
                "http://127.0.0.1:8000/api/predict/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            onPredict(response.data);
        } catch (error) {
            console.error("Prediction Error:", error.response?.data || error.message);
        } finally {
            setIsLoader(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center mx-[30px] my-[20px] p-[30px] rounded-[10px] gap-[10px]"
            style={{
                backgroundImage:
                    "linear-gradient(to left top, #535353, #6c6c6c, #858585, #a0a0a0, #bbbbbb)",
            }}
        >
            <div className="grid gap-[5px] w-[50%]">
                <label htmlFor="stock" className="text-[whitesmoke]">Select stock</label>
                <select
                    className="rounded-[6px] p-[10px] text-[15px] focus:outline-none"
                    value={selectedStock}
                    onChange={(e) => setSelectedStock(e.target.value)}
                >
                    <option value="AAPL">Apple (AAPL)</option>
                    <option value="MSFT">Microsoft (MSFT)</option>
                    <option value="GOOGL">Alphabet (GOOGL)</option>
                    <option value="AMZN">Amazon (AMZN)</option>
                    <option value="TSLA">Tesla (TSLA)</option>
                    <option value="INFY.NS">Infosys (INFY.NS)</option>
                    <option value="TCS.NS">TCS (TCS.NS)</option>
                    <option value="RELIANCE.NS">Reliance (RELIANCE.NS)</option>
                </select>
            </div>
            <div className="grid gap-[5px]">
                <label htmlFor="pdf" className="text-[whitesmoke]">If you have stock related news</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePDFChange}
                    className="p-[8px] text-[14px] bg-[whitesmoke] border border-gray-300 rounded-[6px] cursor-pointer"
                />
            </div>

            {isLoader ? (
                <button className="mt-[25px] p-[10px] flex gap-[5px] rounded-[5px] outline-none border-none text-[15px] bg-[#363636] text-[whitesmoke] cursor-pointer">
                    <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handlePredict}
                    className="mt-[25px] p-[10px] flex gap-[5px] rounded-[5px] outline-none border-none text-[15px] bg-[#363636] text-[whitesmoke] cursor-pointer hover:bg-[#565656] transition"
                >
                    Predict
                </button>
            )}
        </div>
    );
};

export default SearchBar;
