import { CURRENCY } from '../../Enums/Enums'
import { useDispatch, useSelector } from 'react-redux'
import CustomInput from '../Controls/CustomInput'
import Rating from '../UI/Rating'
import CopyButton from '../Controls/CopyText'
import { setBuyCost, setSellPrice } from '../../Redux/Slices/profitCalcSlice'
import CustomCard from '../UI/CustomCard'

const BasicInfo = ({ product }) => {
    const dispatch = useDispatch()
    const { buyCost, sellPrice } = useSelector((state) => state.profitCalc);

    return (
        <CustomCard label={'Basic Info'}>
            <div className='flex gap-4 '>
                <div className=''>
                    <img src={product?.images[0]} className=' w-full h-full min-w-[250px] max-w-[250px] aspect-square bg-white rounded-lg  object-contain' alt="" />
                </div>
                <div>
                    <p>{product?.title}</p>
                    <p className='text-lText text-xs pt-2'>{product?.category}</p>

                    <Rating rating={product?.reviews?.rating} count={product?.reviews?.count} className={'py-2'} />
                    <a className='text-[14px]/[14px] py-2 flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>ASIN:</span>{product?.asin} <CopyButton text={product?.asin} /></a>
                    <div className='flex gap-4 justify-start fontDmmono py-2'>
                        <CustomInput type='number' label={'Buy Cost:'} className={'!w-[120px] !h-[40px]'} prefix={CURRENCY} value={buyCost} onChange={(e) => dispatch(setBuyCost(e.target.value))} min={1} />
                        <CustomInput type='number' label={'Sell Price:'} className={'!w-[120px] !h-[40px]'} prefix={CURRENCY} value={sellPrice} onChange={(e) => dispatch(setSellPrice(e.target.value))} min={1} />
                    </div>
                </div>
            </div>
        </CustomCard>
    )
}

export default BasicInfo