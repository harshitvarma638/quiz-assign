import React from "react";
import Timer from "./Timer";

export default function Navbar() {
    return (
        <nav className="flex navbar navbar-expand-lg navbar-light bg-[#243e8e] justify-center items-center">
            <div className="flex justify-center items-center w-flex h-flex">
                <Timer/>
            </div>
        </nav>
    )
}