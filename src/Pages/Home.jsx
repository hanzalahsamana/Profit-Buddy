import ProductCard from '../Components/UI/ProductCard'
import { useSelector } from 'react-redux'
import ProductCardLoader from '../Components/Loaders/ProductCardLoader'

const Home = () => {
  const { products, productsLoading } = useSelector((state) => state?.products)

  return (
    <div className='bg-lBackground min-h-screen p-5 flex flex-col gap-4'>


      {productsLoading && [1, 2, 3, 4, 5].map((_, index) => (
        <ProductCardLoader key={index} />
      ))}

      {/* Products or no result */}
      {products?.length === 0 ? (
        <div>
          <p className='text-lText text-lg'>Please search products....</p>
        </div>
      ) : (
        products?.map((prod, index) => (
          <ProductCard product={prod} key={prod?.asin || index} />
        ))
      )}
    </div>
  )
}

export default Home