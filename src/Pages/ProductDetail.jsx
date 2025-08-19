import { useSearchParams } from 'react-router-dom';
import { ProductSearchData } from '../Utils/MockData';
import ProfitCalculator from '../Components/Widgets/ProfitCalculator';
import Rating from '../Components/UI/Rating';
import CopyButton from '../Components/Controls/CopyText';
import { useEffect } from 'react';
import { setBuyCost, setProduct, setSellPrice } from '../Redux/Slices/profitCalcSlice';
import { useDispatch, useSelector } from 'react-redux';
import CustomInput from '../Components/Controls/CustomInput';
import { CURRENCY } from '../Enums/Enums';
import BASE_URL from '../../config';

const ProductDetail = () => {
    const [searchParams] = useSearchParams();
    const { products } = useSelector((state) => state?.products)
    const asin = searchParams.get("asin");
    const dispatch = useDispatch()

    // const product = ProductSearchData[0]

    const {
        buyCost,
        sellPrice,
        product,
    } = useSelector((state) => state.profitCalc);

    useEffect(() => {
        const product = products?.find((prod) => prod?.asin === asin)
        if (!product) {
            dispatch(setProduct(ProductSearchData[0]))
        } else {
            dispatch(setProduct(product))
        }
    }, [products])



    return (
        <div className=' text-secondary min-h-screen bg-lBackground '>
            <div className='grid grid-cols-3 gap-2 h-full items-start py-4 px-8'>
                <div className='col-span-2 flex flex-col gap-6 px-3'>
                    <div className=' bg-primary rounded-lg border border-border p-3 '>
                        {/* <h1 className='text-[32px] font-semibold fontDmmono'>Sales Graph</h1> */}
                        <div className='flex gap-3 '>
                            <div className=''>
                                <img src={product?.images[0]} className=' w-full h-full min-w-[250px] max-w-[250px] aspect-square bg-white rounded-lg  object-contain' alt="" />
                            </div>
                            <div>
                                <p>{product?.title}</p>
                                <p className='text-lText text-xs pt-2'>{product?.category}</p>

                                <Rating rating={product?.reviews?.rating} count={product?.reviews?.count} className={'py-2'} />
                                <a className='text-[14px]/[14px] py-2 flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>ASIN:</span>{product?.asin} <CopyButton text={product?.asin} /></a>
                                <div className='flex gap-4 justify-start fontDmmono py-2'>
                                    <CustomInput type='number' label={'Buy Cost:'} className={'!w-[120px] !h-[40px]'} prefix={CURRENCY} value={buyCost} onChange={(e) => dispatch(setBuyCost(e.target.value))} />
                                    <CustomInput type='number' label={'Sell Price:'} className={'!w-[120px] !h-[40px]'} prefix={CURRENCY} value={sellPrice} onChange={(e) => dispatch(setSellPrice(e.target.value))} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3 bg-primary border border-border rounded-lg p-3 '>
                        <h1 className='text-[32px] font-semibold fontDmmono'>Sales Graph</h1>
                        <div className='w-full '>
                            <img className='object-contain rounded-lg w-full' src={`${BASE_URL}/get/get-graph-image?asin=${product?.asin}`} alt="" />
                        </div>
                    </div>
                </div>

                <ProfitCalculator product={product} />
            </div>
        </div>
    );
}

export default ProductDetail