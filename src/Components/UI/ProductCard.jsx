import { useEffect, useState } from 'react'
import Rating from './Rating'
import CopyButton from '../Controls/CopyText'
import BASE_URL from '../../../config'
import ButtonLoader from '../Loaders/ButtonLoader'
import { formatNumberWithCommas } from '../../Utils/NumberUtil'
import { calculateMaxCost, calculateTotalFees } from '../../Utils/CalculationUtils'
import { abbreviateNumber } from './../../Utils/NumberUtil';
import { getProductOffers } from '../../Apis/product'
import { Link, useNavigate } from 'react-router-dom'
import KeepaChart from './KeepaStyleGraph'

const ProductCard = ({ product }) => {
  const [loading, setloading] = useState(false)
  const [productOffers, setproductOffers] = useState({})

  const navigate = useNavigate();


  const handleGetOffers = async () => {
    try {
      setloading(true)
      const responce = await getProductOffers(product?.asin)
      setproductOffers(responce?.offer)
      setloading(false)
    } catch (error) {
      setloading(false)
      console.error(error.response ? error.response.data.message : error.message);
    }
  }

  useEffect(() => {
    if (!product) return
    handleGetOffers()
  }, [product])


  return (
    <Link to={`/detail?asin=${product?.asin}`}>
      <div className='flex gap-2 md:gap-7 border border-border rounded-[10px] bg-primary transition-transform cursor-pointer h-[240px] '>
        <div className='flex flex-1 gap-4 w-full h-full col-span-4'>
          <div className="grid gap-2 h-full p-3"
            style={{
              gridTemplateColumns: "repeat(3,auto)",
              gridTemplateRows: "repeat(3,auto)"
            }}
          >
            {(() => {
              const imgs = product?.images?.slice(1, 4).filter(Boolean) || [];
              while (imgs.length < 3 && imgs.length > 0) {
                imgs.push(imgs[imgs.length - 1]);
              }
              return imgs.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square bg-white border border-border rounded-[8px] overflow-hidden"
                  style={{ gridRowStart: i + 1 }}
                >
                  <img
                    src={img}
                    alt={`product-thumbnail-${i + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ));
            })()}

            <div className="col-span-2 row-span-3 bg-white border border-border rounded-[8px] overflow-hidden">
              <img
                src={product?.images?.[0]}
                alt="product"
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          <div className='flex flex-col justify-start'>
            <p
              className="text-secondary pt-2 text-sm font-medium " title={product?.title}>
              {product?.title?.length > 80 ? product.title.slice(0, 80) + "..." : product?.title}
            </p>
            <p className='text-lText text-[12px] py-1'>{product?.category}</p>
            <Rating rating={product?.reviews?.rating} count={product?.reviews?.count} />
            <a className='text-[12px]/[12px] py-2 flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>ASIN:</span>{product?.asin} <CopyButton text={product.asin} /></a>
            <div className="overflow-x-auto border-[1.5px] border-accent rounded-lg max-w-md">
              <table className="min-w-full border border-accent rounded-lg overflow-hidden !text-xs">
                <thead className="bg-accent/15">
                  <tr>
                    <th className="px-1 py-2 text-center text-xs font-medium text-secondary border-r border-accent">
                      Est Sales
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-secondary border-r border-accent">
                      Sale Cost
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-secondary border-r border-accent">
                      BSR Rank
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-medium text-secondary">
                      Max Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-accent/5 transition">
                    <td className="px-1 py-1 text-center text-lText border-r border-accent">{abbreviateNumber(product?.info?.monthlySold)}+/mo</td>
                    <td className="px-1 py-1 text-center text-lText border-r border-accent">{formatNumberWithCommas(product?.info?.sellPrice)}</td>
                    <td className="px-1 py-1 text-center text-lText border-r border-accent"># {product?.info?.sellRank}</td>
                    <td className="px-1 py-1 text-center text-lText">{formatNumberWithCommas(calculateMaxCost(product?.info?.sellPrice, calculateTotalFees(product, product?.info?.sellPrice)))}</td>
                  </tr>
                </tbody>
              </table>
            </div>


          </div>
        </div>

        <div className='w-max h-full flex'>

          <div className="overflow-x-auto customScroll border-[1.5px] border-accent w-[200px]  ">
            {loading ? (
              <ButtonLoader className='py-[70px] h-[100%]' />
            ) : (
              <div className="max-h-[160px] overflow-y-auto customScroll  ">
                <p className='text-sm py-1 text-center bg-accent text-black font-medium'>Top Offers</p>
                <table className="min-w-full !text-xs">
                  <thead className="bg-accent/10 backdrop-blur-2xl sticky top-0 z-10">
                    <tr>
                      <th className="px-1 py-1.5 text-center text-xs font-medium text-secondary border-r border-accent">
                        Seller
                      </th>
                      <th className="px-1 py-1.5 text-center text-xs font-medium text-secondary border-r border-accent">
                        Stock
                      </th>
                      <th className="px-1 py-1.5 text-center text-xs font-medium text-secondary">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productOffers?.offers?.map((offer, index) => (
                      <tr
                        key={index}
                        className="hover:bg-accent/5 transition"
                      >
                        <td className="px-1 py-1.5 text-center text-lText border-r border-accent font-semibold">
                          {offer?.seller}
                        </td>
                        <td className="px-1 py-1.5 text-center text-lText border-r border-accent">
                          {offer?.stock || "-"}
                        </td>
                        <td className="px-1 py-1.5 text-center text-lText">
                          {formatNumberWithCommas(offer?.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
          <div className='w-[450px] h-full overflow-hidden '>
            <KeepaChart graphData={product?.graphData} showLegend={true} size='small' />
            {/* <img className='object-fill w-full !h-full' src={`${BASE_URL}/get/get-graph-image?asin=${product?.asin}`} alt="" /> */}
          </div>
        </div>
      </div >
    </Link>

  )
}

export default ProductCard