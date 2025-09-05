import React from 'react'
import { IoIosArrowDown } from 'react-icons/io'

const CustomCard = ({ label, action, className, children }) => {
    return (
        <div className={`border border-border rounded-lg flex flex-col w-full bg-primary ${className}`}>
            {(label || action) && (
                <div className='flex justify-between w-full items-center bg-secondary/5 p-4 rounded-t-lg border-b border-border cursor-pointer hover:bg-secondary/5'>
                    {label && (<h1 className='text-[24px]/[24px] text-secondary font-semibold fontDmmono'>{label}</h1>)}
                    <IoIosArrowDown size={20} />
                    {action && (action)}
                </div>)}
            {children && (
                <div className='p-5'>
                    {children}
                </div>
            )}
        </div>
    )
}

export default CustomCard