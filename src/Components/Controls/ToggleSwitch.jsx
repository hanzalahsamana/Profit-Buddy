import { div } from "framer-motion/client";
import React from "react";
import InfoTooltip from "./InfoTooltip";

const ToggleSwitch = ({ options = [], selected, onChange, className, label, info }) => {
    const selectedIndex = options.indexOf(selected) !== -1 ? options.indexOf(selected) : 0

    return (

        <div className={`flex items-center gap-2 justify-between ${className}`}>
            {label && (
                <label className="flex gap-2 items-center text-sm font-medium text-secondary fontDmmono">
                    {label}
                    {info && (<InfoTooltip content={info} id={`InputInfo_${label}`} />)}
                </label>
            )}

            <div className={`p-1 bg-accent rounded-full overflow-hidden  `}>
                <div className="relative flex bg-accent rounded-full ">
                    {/* Active background */}
                    <div
                        className="absolute  h-full bg-primary rounded-full transition-all duration-300"
                        style={{
                            width: `${100 / options.length}%`,
                            left: `${(selectedIndex * 100) / options.length}%`,
                        }}
                    />

                    {options.map((option, i) => (
                        <button
                            key={option}
                            className={`relative px-5 py-1 cursor-pointer flex-1 text-center text-[14px] font-medium z-10 transition-colors fontDmmono ${selectedIndex === i ? "text-accent" : "text-primary"
                                }`}
                            onClick={() => onChange(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default ToggleSwitch;
