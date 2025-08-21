import { useSearchParams } from 'react-router-dom';
import { OfferData, ProductSearchData } from '../Utils/MockData';
import ProfitCalculator from '../Components/Widgets/ProfitCalculator';
import { useEffect, useState } from 'react';
import { setProduct } from '../Redux/Slices/profitCalcSlice';
import { useDispatch, useSelector } from 'react-redux';
import TopOffers from '../Components/Widgets/TopOffers';
import BasicInfo from '../Components/Widgets/BasicInfo';
import Graphs from '../Components/Widgets/Graphs';
import DynamicChart from '../Components/UI/DynamicChart';
import { OfferGraphKeys, SalesGraphKeys } from '../Enums/Enums';
import CustomCard from '../Components/UI/CustomCard';
import { getProductOffers, searchProducts } from '../Apis/product';
import { FiLoader } from "react-icons/fi";
import { MdOutlineSearchOff } from "react-icons/md";

const ProductDetail = () => {
    const [searchParams] = useSearchParams();
    const asin = searchParams.get("asin");

    const [loading, setLoading] = useState(false);
    const [offerLoading, setOfferLoading] = useState(false);
    const [productOffers, setProductOffers] = useState(null);

    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { product } = useSelector((state) => state.profitCalc);

    const handleGetProduct = async () => {
        const found = products?.find((p) => p?.asin === asin);
        if (found) {
            dispatch(setProduct(found));
        } else {
            try {
                setLoading(true);
                const result = await searchProducts(asin);
                if (result?.length) {
                    dispatch(setProduct(result[0]));
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGetOffer = async () => {
        try {
            setOfferLoading(true);
            const responce = await getProductOffers(asin);
            setProductOffers(responce?.offer);
        } catch (error) {
            console.error("Failed to fetch offers:", error);
        } finally {
            setOfferLoading(false);
        }
    };

    useEffect(() => {
        if (!asin) return;
        handleGetProduct();
        handleGetOffer();
    }, [asin, products]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-primary">
                <FiLoader className="w-6 h-6 animate-spin mb-2" />
                <p className="text-sm">Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <MdOutlineSearchOff className="w-8 h-8 mb-2" />
                <p className="text-sm">Oops, looks like this product does not exist.</p>
            </div>
        );
    }

    return (
        <div className='grid grid-cols-5 gap-4 h-full items-start p-4 text-secondary min-h-screen bg-lBackground'>
            <div className='col-span-3 flex flex-col gap-4'>
                <BasicInfo product={product} />
                <TopOffers product={product} productOffers={productOffers} offerLoading={offerLoading} />
                {/* <Graphs product={product} /> */}
                <CustomCard label={'Price History'}>
                    <DynamicChart graphData={product?.graphData?.salesGraph} graphKeys={SalesGraphKeys} />
                </CustomCard>
            </div>

            <div className='col-span-2 flex flex-col gap-4'>
                <ProfitCalculator product={product} />
                <CustomCard label={'Offer Count'}>
                    <DynamicChart graphData={product?.graphData?.offerGraph} graphKeys={OfferGraphKeys} />
                </CustomCard>
            </div>
        </div>
    );
}

export default ProductDetail