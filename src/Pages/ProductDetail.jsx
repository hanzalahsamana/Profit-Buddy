import { useSearchParams } from 'react-router-dom';
import { OfferData, ProductSearchData } from '../Utils/MockData';
import ProfitCalculator from '../Components/Widgets/ProfitCalculator';
import Rating from '../Components/UI/Rating';
import CopyButton from '../Components/Controls/CopyText';
import { useEffect } from 'react';
import { setBuyCost, setProduct, setSellPrice } from '../Redux/Slices/profitCalcSlice';
import { useDispatch, useSelector } from 'react-redux';
import CustomInput from '../Components/Controls/CustomInput';
import { CURRENCY } from '../Enums/Enums';
import BASE_URL from '../../config';
import CustomCard from '../Components/UI/CustomCard';
import { formatNumberWithCommas } from '../Utils/NumberUtil';
import { calculateProfitAndROI } from '../Utils/CalculationUtils';
import TopOffers from '../Components/Widgets/TopOffers';
import BasicInfo from '../Components/Widgets/BasicInfo';
import SalesGraph from '../Components/Widgets/SalesGraph';

const ProductDetail = () => {
    const [searchParams] = useSearchParams();
    const { products } = useSelector((state) => state?.products)
    const asin = searchParams.get("asin");
    const dispatch = useDispatch()

    const productOffers = OfferData

    const { product } = useSelector((state) => state.profitCalc);

    useEffect(() => {
        const product = products?.find((prod) => prod?.asin === asin)
        if (!product) {
            dispatch(setProduct(ProductSearchData[0]))
        } else {
            dispatch(setProduct(product))
        }
    }, [products])

    return (
        <div className='grid grid-cols-5 gap-4 h-full items-start p-4 text-secondary min-h-screen bg-lBackground'>
            <div className='col-span-3 flex flex-col gap-4'>
                <SalesGraph product={product} />
                <BasicInfo product={product} />
                <TopOffers product={product} productOffers={productOffers} />
            </div>

            <div className='col-span-2 flex flex-col gap-4'>
                <ProfitCalculator product={product} />
            </div>
        </div>
    );
}

export default ProductDetail