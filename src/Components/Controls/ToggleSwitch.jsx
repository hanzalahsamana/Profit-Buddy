import { useState } from "react";

export default function ToggleSwitch({ label = '', enabled = false, setEnabled = () => { } }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-white">{label}</span>
            <button
                onClick={() => setEnabled(!enabled)}
                className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 
          ${enabled ? "bg-transparent border-2 border-accent" : "bg-transparent border-2 border-accent"}`}
            >
                <div
                    className={`w-2 h-2 !rounded-full bg-accent transition-transform duration-300 
            ${enabled ? "translate-x-5" : "translate-x-0"}`}
                ></div>
            </button>
        </div>
    );
}
