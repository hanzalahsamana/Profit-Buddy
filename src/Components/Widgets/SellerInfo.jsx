import React from 'react'
import CustomCard from '../UI/CustomCard'
import Rating from '../UI/Rating'
import { TbExternalLink } from "react-icons/tb";
import Button from '../Controls/Button';
import { IoWarningOutline } from 'react-icons/io5';
import { CiDeliveryTruck } from "react-icons/ci";

const SellerInfo = ({ className , seller }) => {
    return (
        <CustomCard className={className}>
            <div className='flex items-center justify-between gap-2'>
                <p className='text-3xl font-semibold '><span className='font-semibold text-base'></span> Ajmal Electronics</p>

                <Button
                    variant='outline'
                    corner='full'
                    size='small'
                    action={()=>window.open(`https://www.amazon.com/s?me=${seller?.id}`, "_blank")}
                    label={<span className='flex items-center gap-2'>
                        <img className='w-[20px]' src="https://img.icons8.com/color/96/amazon.png" alt="Amazon Search" />
                        View On Amazon
                    </span>}
                />

            </div>
            <div className='text-xl flex gap-2 items-center'><span className='font-semibold text-base'>Seller Reviews:</span> <Rating count={3} rating={3} /></div>

            <div className='pt-[20px] '>
                <div className='flex gap-2 items-center justify-between'>
                    <p className=' text-base'>ASIN Count:</p>
                    <p className='text-xl'>145</p>
                </div>

                <div className='flex gap-2 items-center justify-between'>
                    <p className=' text-base'>Ships From:</p>
                    <p className='text-base flex items-center gap-2'>Local Warehouse</p>
                </div>
                <div className='flex gap-2 items-center justify-between'>
                    <p className=' text-base'>Seller Id:</p>
                    <p className='text-base flex items-center gap-2'>Local Warehouse</p>
                </div>
                {/* 
                <div className='flex gap-2 items-center justify-start bg-orange-200 text-orange-700 rounded-md px-3 py-2.5 mt-3'>
                    <IoWarningOutline size={15} />
                    <p className='text-xs'>ASIN, brand, and category counts serve as an estimate and may not be exact.</p>
                </div> */}


            </div>
        </CustomCard >
    )
}

export default SellerInfo