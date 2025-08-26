import { useEffect, useState } from 'react'
import Rating from './Rating'
import CopyButton from '../Controls/CopyText'
import { formatNumberWithCommas } from '../../Utils/NumberUtil'
import { calculateMaxCost, calculateProfit, calculateTotalFees } from '../../Utils/CalculationUtils'
import { abbreviateNumber } from './../../Utils/NumberUtil';
import { Link } from 'react-router-dom'
import DynamicChart from './DynamicChart'
import { SalesGraphKeys } from '../../Enums/Enums'
import ProductImageGrid from './ProductImageGrid'
import { FiLoader } from 'react-icons/fi'
import { Tooltip } from 'react-tooltip'
import { getProductOffers } from '../../Apis/Offer'
import AnimationWrapper from '../Layout/AnimationWrapper'
import ProductActionButtons from './ProductActionButtons'


const ProductCard = ({ product }) => {

  const { info, graphData, images, reviews } = product
  const [loading, setloading] = useState(false)
  const [productOffers, setproductOffers] = useState({})

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
    <AnimationWrapper>
      <Link to={`/detail?asin=${product?.asin}`}>
        <div className='flex gap-2 md:gap-3 p-3  border border-border rounded-[10px] bg-primary transition-transform cursor-pointer h-[250px] '>
          <div className='flex flex-1 gap-2 w-full h-full col-span-4 relative'>
            <ProductImageGrid images={images} />

            <div className='flex flex-col justify-between'>
              <p className="text-secondary pt-2 text-sm font-medium line-clamp-2" title={product?.title}>
                {product?.title}
              </p>
              <p className='text-lText text-[14px] '>{product?.category}</p>
              <Rating rating={reviews?.rating} count={reviews?.count} />
              <div className='flex gap-3 items-center'>
                <p className='text-[14px]/[14px] py-2 flex items-end gap-1 text-secondary'><span className='text-lText text-[14px]/[14px]'>ASIN:</span>{product?.asin} <CopyButton text={product.asin} /></p>
                <ProductActionButtons product={product} className={'!static !grid-cols-4 !grid-rows-1 w-[140px]'} />
              </div>
              <div className="overflow-x-auto border-[1.5px] border-accent rounded-lg max-w-md content-end">
                <table className="min-w-full border border-accent rounded-lg overflow-hidden !text-sm">
                  <thead className="bg-accent/15">
                    <tr>
                      <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                        Est Sales
                      </th>
                      <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                        Sale Cost
                      </th>
                      <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                        BSR Rank
                      </th>
                      <th className="px-1 py-1.5 text-center font-medium text-secondary">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-accent/5 transition">
                      <td className="px-1 py-1.5 text-center text-lText border-r border-accent">{info?.monthlySold ? `${abbreviateNumber(info?.monthlySold)}+/mo` : 'No Record'}</td>
                      <td className="px-1 py-1.5 text-center text-lText border-r border-accent">{formatNumberWithCommas(info?.sellPrice)}</td>
                      <td className="px-1 py-1.5 text-center text-lText border-r border-accent">#{formatNumberWithCommas(info?.sellRank, 0, false, true)}</td>
                      <td className="px-1 py-1.5 text-center text-lText">
                        {(() => {
                          const totalFees = calculateTotalFees(product, info?.sellPrice)?.totalFees || 0;
                          const maxCost = calculateMaxCost(info?.sellPrice, totalFees);
                          const profit = calculateProfit(info?.sellPrice, maxCost, totalFees);
                          return formatNumberWithCommas(profit);
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="border-[1.5px] border-accent w-[200px] rounded-lg overflow-hidden">
            <p className="text-sm py-1 text-center bg-accent sticky top-0 text-black font-medium">
              Top Offers
            </p>

            <table className="min-w-full !text-xs table-fixed">
              <thead className="bg-accent/10 backdrop-blur-2xl z-10">
                <tr>
                  <th className=" py-1.5 text-center text-xs font-medium text-secondary border-r border-accent">
                    Seller
                  </th>
                  <th className=" py-1.5 text-center text-xs font-medium text-secondary border-r border-accent">
                    Stock
                  </th>
                  <th className=" py-1.5 text-center text-xs font-medium text-secondary">
                    Price
                  </th>

                </tr>
              </thead>
            </table>

            <div className="max-h-[180px] overflow-y-auto hideScroll">
              <table className="min-w-full !text-xs table-fixed">
                <tbody>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-3 align-middle text-gray-500 bg-primary">
                      <FiLoader className="w-6 h-6 animate-spin mb-2" />
                      <p className="text-sm">Loading Offers...</p>
                    </div>
                  ) : (
                    productOffers?.offers?.length > 0 ? (
                      productOffers.offers.map((offer, index) => (
                        <tr
                          key={index}
                          className="hover:bg-accent/5 transition"
                        >
                          <td className="px-1 py-1.5 text-center text-lText border-r border-accent font-semibold">
                            <span data-tooltip-id={offer?.sellerInfo?.id} className='cursor-pointer'>{offer?.seller}</span>

                          </td>
                          <td className="px-1 py-1.5 text-center text-lText border-r border-accent">
                            {offer?.stock || "-"}
                          </td>
                          <td className="px-1 py-1.5 text-center text-lText">
                            {formatNumberWithCommas(offer?.price)}
                          </td>
                          <Tooltip
                            id={offer?.sellerInfo?.id}
                            place="top"
                            className="!bg-secondary !bg-opacity-100 !p-2 !text-[12px] !text-primary !items-center !rounded-md !transition-none !backdrop-blur-0 !shadow-lg"
                            content={
                              <div className="text-left space-y-0.5">
                                <div className="font-medium text-white mb-1 text-[12px]">{offer?.sellerInfo?.name}</div>
                                <Rating className={'text-[12px]'} count={offer?.sellerInfo?.ratingCount} rating={offer?.sellerInfo?.rating} />
                              </div>
                            }
                          />
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center text-lText py-3 align-middle"
                        >
                          No offers
                        </td>
                      </tr>
                    )
                  )}

                </tbody>
              </table>
            </div>
          </div>

          <div className='flex items-center h-full bg-white rounded-lg '>
            <div className='w-[450px] h-max overflow-hidden  '>
              <DynamicChart graphData={graphData?.salesGraph} graphKeys={SalesGraphKeys} showLegend={false} size='small' />
            </div>
          </div>
        </div >
      </Link>
    </AnimationWrapper>


  )
}

export default ProductCard