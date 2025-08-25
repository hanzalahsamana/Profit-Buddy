import React from 'react'
import ProductDetail from './ProductDetail'
import SellerInfo from '../Components/Widgets/SellerInfo'
import CustomCard from '../Components/UI/CustomCard'
import { useSearchParams } from 'react-router-dom'

const SellerProfile = () => {
    const [searchParams] = useSearchParams();
    const sellerId = searchParams.get("sellerid");

    const handleGetSeller = async () => {
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

    return (
        <div className='grid grid-cols-4 gap-4 h-full items-start p-4 text-secondary min-h-screen bg-lBackground'>
            <SellerInfo className={'col-span-2'} seller={{ id: sellerId }} />
            <CustomCard label={'Categories'}></CustomCard>
            <CustomCard label={'Brands'}></CustomCard>
        </div>
    )
}

export default SellerProfile