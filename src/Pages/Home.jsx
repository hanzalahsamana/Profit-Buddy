import ProductCard from '../Components/UI/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import ProductCardLoader from '../Components/Loaders/ProductCardLoader'
import Button from '../Components/Controls/Button'
import { useEffect } from 'react'
import { searchProducts } from '../Apis/product'
import { toast } from 'react-toastify'
import { setCurrentPage } from '../Redux/Slices/ProductSlice'
import { ProductSearchData } from '../Utils/MockData'

const Home = () => {
  const { products, currentPage, productsLoading, searchTerm } = useSelector((state) => state?.products)
  const dispatch = useDispatch()

  const handleSearchProducts = async ({ searchQuery, page }) => {
    if (productsLoading) return
    try {
      await searchProducts(searchQuery, page);
      toast.success('Fetched successfully!');
    } catch (error) {
      // toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  useEffect(() => {
    if (!searchTerm) return
    handleSearchProducts({ searchQuery: searchTerm, page: currentPage })
  }, [currentPage, searchTerm])



  return (
    <div className='bg-lBackground min-h-screen p-5 flex flex-col gap-4'>

      <ProductCard product={ProductSearchData?.[0]} />
      {productsLoading && [1, 2, 3, 4, 5].map((_, index) => (
        <ProductCardLoader key={index} />
      ))}

      {products?.length === 0 ? (
        <div>
          <p className='text-lText text-lg'>Please search products....</p>
        </div>
      ) : (
        products?.map((prod, index) => (
          <ProductCard product={prod} key={prod?.asin || index} />
        ))
      )}
      <div className='w-full flex justify-center'>
        {products?.length > 0 && (
          <Button label='Load More' corner='full' variant='secondary' action={() => dispatch(setCurrentPage(currentPage + 1 || 0))} />
        )}
      </div>
    </div>
  )
}

export default Home