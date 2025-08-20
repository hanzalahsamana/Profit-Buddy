import React from 'react'

const CustomCard = ({ label, className, children }) => {
    return (
        <div className={`border border-border rounded-lg flex flex-col w-full bg-primary p-5 gap-5 ${className}`}>
            {label && (<h1 className='text-[24px]/[24px] font-semibold fontDmmono'>{label}</h1>)}
            <div>
                {children}

            </div>
        </div>
    )
}

export default CustomCard