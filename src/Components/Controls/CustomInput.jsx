import clsx from "clsx";
import InfoTooltip from "./InfoTooltip";

const CustomInput = ({
    label,
    value,
    onChange,
    placeholder,
    prefix,
    suffix,
    className,
    error,
    disabled,
    name,
    type = "text",
    info,
    ...props
}) => {
    return (
        <div className={`w-full fontDmmono ${disabled ? 'opacity-80 pointer-events-none select-none' : ''}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="flex gap-2 items-center  mb-2 text-sm font-medium  text-secondary"
                >
                    {label}
                    {info && (<InfoTooltip content={info} id={`InputInfo_${label}`} />)}
                </label>
            )}

            <div
                className={clsx(
                    "flex border rounded-md focus-within:ring focus-within:ring-secondary h-11 transition-all overflow-hidden",
                    error ? "border-red-500" : "border-border",
                    disabled && "opacity-60 cursor-not-allowed",
                    className
                )}
            >
                {prefix && (
                    <div className="px-3 flex justify-center items-center text-lText h-full text-[15px] bg-lBackground border-r border-border ">
                        {prefix}
                    </div>
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    step="any" 
                    className={clsx(
                        "flex-1 bg-transparent border-none h-full outline-none px-3  w-full text-[16px] font-medium text-secondary",
                        "placeholder:text-lText placeholder:font-normal"
                    )}
                    {...props}
                />

                {suffix && (
                    <span className="px-3 flex justify-center items-center text-lText h-full text-[15px] bg-lBackground border-l border-border ">
                        {suffix}
                    </span>
                )}
            </div>

            {error && <p className="mt-1 text-xs !text-red-500">{error}</p>}
        </div>
    );
};

export default CustomInput;
