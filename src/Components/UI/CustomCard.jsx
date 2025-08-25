import React from 'react'

const CustomCard = ({ label, action, className, children }) => {
    return (
        <div className={`border border-border rounded-lg flex flex-col w-full bg-primary p-5 gap-5 ${className}`}>
            {(label || action) && (
                <div className='flex justify-between w-full items-center'>
                    {label && (<h1 className='text-[24px]/[24px] font-semibold fontDmmono'>{label}</h1>)}
                    {action && (action)}
                </div>)}
            <div>
                {children}
            </div>
        </div>
    )
}

export default CustomCard