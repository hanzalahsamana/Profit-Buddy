import { useEffect, useState } from 'react'
import SellerInfo from '../Components/Widgets/SellerInfo'
import { useSearchParams } from 'react-router-dom'
import ProductCardLoader from '../Components/Loaders/ProductCardLoader'
import { getSellerInfo } from '../Apis/Seller'
import { MdOutlineSearchOff } from 'react-icons/md'
import { FiLoader } from 'react-icons/fi'
import { findProductAsin, getProduct } from '../Apis/Product'
import ProductCard from '../Components/UI/ProductCard'
import CustomCard from '../Components/UI/CustomCard'

const SellerProfile = () => {
    const [searchParams] = useSearchParams();
    const sellerId = searchParams.get("sellerid");

    const [seller, setSeller] = useState({})
    const [sellerLoading, setSellerLoading] = useState(false)
    const [sellerProducts, setSellerProducts] = useState([])
    const [sellerProductsLoading, setSellerProductsLoading] = useState(false)
    const [productsQuery, setProductsQuery] = useState({})
    const [sellerAsins, setSellerAsins] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 10

    const handleGetSeller = async () => {
        try {
            setSellerLoading(true);
            const response = await getSellerInfo(sellerId);
            setSeller(response)
        } catch (error) {
            console.error("Failed to fetch Seller:", error);
        } finally {
            setSellerLoading(false);
        }
    };

    const handleGetSellerAsins = async () => {
        try {
            setSellerProductsLoading(true);
            const asins = await findProductAsin({ ...productsQuery, sellerIds: sellerId });
            if (!asins) throw ("asins not found")
            setSellerAsins(asins)
        } catch (error) {
            console.error("Failed to fetch Seller Asins:", error);
        } finally {
            setSellerProductsLoading(false);
        }
    };
    
    const handleGetSellerProducts = async () => {
        try {
            setSellerProductsLoading(true);
            const validPageAsins = sellerAsins?.slice((currentPage - 1) * limit, currentPage * limit);
            console.log(validPageAsins);
            const products = await getProduct(validPageAsins);
            setSellerProducts(products)
        } catch (error) {
            console.error("Failed to fetch Seller Asins:", error);
        } finally {
            setSellerProductsLoading(false);
        }
    };

    useEffect(() => {
        if (!sellerId) return
        handleGetSeller()
    }, [sellerId])

    useEffect(() => {
        if (!sellerId) return
        handleGetSellerAsins()
    }, [sellerId, productsQuery])

    useEffect(() => {
        if (!sellerAsins || !sellerAsins?.length) return
        handleGetSellerProducts()
    }, [sellerAsins])

    if (sellerLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-lText bg-primary">
                <FiLoader className="w-8 h-8 animate-spin mb-2" />
                <p className="text-lg">Loading Seller...</p>
            </div>
        );
    }

    if (!seller || !Object?.keys(seller).length) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-lText">
                <MdOutlineSearchOff className="w-8 h-8 mb-2" />
                <p className="text-lg">Oops, looks like this seller does not exist.</p>
            </div>
        );
    }

    return (
        <div className=' bg-lBackground p-4  flex flex-col gap-4'>
            <SellerInfo className={'col-span-2'} seller={seller} />

            <h1 className='text-[34px]/[34px] bg-primary p-4 border-border border rounded-lg text-secondary font-semibold fontDmmono'>Products</h1>

            <div className='flex flex-col gap-4 col-span-4'>
                {sellerProductsLoading ? [1, 2, 3, 4, 5].map((_, index) => (
                    <ProductCardLoader key={index} />
                )) : (
                    sellerProducts?.map((prod, index) => {
                        return (
                            <ProductCard product={prod} key={index} />
                        )
                    })
                )}
            </div>

        </div>
    )
}
export default SellerProfile
