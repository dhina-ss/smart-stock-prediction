import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    return (
        <header className="flex justify-between bg-[#f4faff] items-center px-[30px] py-[20px] relative left-[0] top-[0] bg-blue-600 text-white shadow-md">
            <h2 className="m-[0] text-[26px] cursor-pointer">Smart Stock Prediction</h2>
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow">
                <FontAwesomeIcon icon={faUser} className="text-[16px] cursor-pointer" />
            </div>
        </header>
    );
};

export default Header;
