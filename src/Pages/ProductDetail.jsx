import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { ProductSearchData } from '../Utils/MockData';
import CustomInput from '../Components/Controls/CustomInput';
import RangeSelector from '../Components/Controls/RangeSelector';
import { formatNumberWithCommas } from '../Utils/NumberUtil';
import ToggleSwitch from './../Components/Controls/ToggleSwitch';

const ProductDetail = () => {
    const [searchParams] = useSearchParams();
    const asin = searchParams.get("asin");
    const [range, setRange] = useState(80);

    return (
        <div className='bg-primary text-secondary min-h-screen fontDmmono'>
            <div className='grid grid-cols-2 gap-2'>
                <div className=''>
                    <img src={ProductSearchData[0]?.images[0]} className=' w-full h-full max-w-[200px]' alt="" />
                </div>

                <div className='w-[100%] h-[200px]'>
                    <h1 className='text-[32px] font-semibold fontDmmono'>Profit Calculator</h1>
                    <div className='flex flex-col gap-4 py-[20px] max-w-md'>
                        <div className='flex gap-4'>
                            <CustomInput placeholder={'Buy Cost'} prefix={'$'} label={'Buy Cost'} info={''} />
                            <CustomInput placeholder={'Sell Price'} prefix={'$'} label={'Sell Price:'} />
                        </div>
                        <ToggleSwitch options={['FBA', 'FBM']} label={'Fulfillment Type:'} className={'w-max'} />
                        <RangeSelector
                            min={0}
                            max={100}
                            step={1}
                            value={range}
                            onChange={setRange}
                            marks={[0, 25, 50, 75, 100]}
                            formatLabel={(n) => formatNumberWithCommas(n, 0, false)}
                            label={'Storage Month:'}
                        />
                        {/* <CustomInput placeholder={'Max Cost'} prefix={'$'} label={'Sale Price:'} /> */}
                        <div className='grid grid-cols-2 gap-2'>
                            <div className='border border-border p-3 rounded-lg bg-border flex justify-between text-lg'>
                                <p className='font-medium'>Profit:</p>
                                <p className='text-end'>$56.00</p>
                            </div>
                            <div className='border border-border p-3 rounded-lg bg-border flex justify-between text-lg'>
                                <p className='font-medium'>ROI(%):</p>
                                <p className='text-end'>45%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail