import { useEffect, useState } from 'react'
import Rating from './Rating'
import CopyButton from '../Controls/CopyText'
import { formatNumberWithCommas } from '../../Utils/NumberUtil'
import { calculateMaxCost, calculateProfit, calculateTotalFees } from '../../Utils/CalculationUtils'
import { abbreviateNumber } from './../../Utils/NumberUtil';
import { Link } from 'react-router-dom'
import DynamicChart from './DynamicChart'
import { OfferGraphKeys, SalesGraphKeys } from '../../Enums/Enums'
import ProductImageGrid from './ProductImageGrid'
import { FiLoader } from 'react-icons/fi'
import { Tooltip } from 'react-tooltip'
import { getProductOffers } from '../../Apis/Offer'
import AnimationWrapper from '../Layout/AnimationWrapper'
import ProductActionButtons from './ProductActionButtons'
import { OfferData } from '../../Utils/MockData'
import { redirectForSeller } from '../../Helpers/Redirects'


const ProductCard = ({ product }) => {

  const { info, graphData, images, reviews } = product
  const [loading, setloading] = useState(false)
  const [productOffers, setproductOffers] = useState({})

  const { offers } = productOffers || {}

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
        <div className='p-3 rounded-[10px] bg-primary transition-shadow cursor-pointer  hover:shadow-md hover:border-lText/30'>
          <div className='flex gap-2 md:gap-3  w-full '>
            <div className='flex flex-1 gap-2 w-full col-span-4 relative h-[250px]'>
              <ProductImageGrid images={images} listPrice={info?.listPrice} />

              <div className='flex flex-col flex-1 justify-evenly gap-3'>
                <p className="text-secondary text-base/[22px] font-medium line-clamp-2" title={product?.title}>
                  {product?.title}
                </p>
                <div className='flex items-end gap-2.5'>
                  <div className='flex flex-1 flex-col gap-3  justify-between  '>
                    {product?.category && (<p className='text-[14px]/[14px] flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>Category:</span>{product?.category}</p>)}
                    {product?.brand && (<p className='text-[14px]/[14px] flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>Brand:</span>{product?.brand}</p>)}
                    <Rating rating={reviews?.rating} count={reviews?.count} />
                    <p className='text-[14px]/[14px] flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>ASIN:</span>{product?.asin} <CopyButton text={product.asin} /></p>
                    <div className="overflow-x-auto border-[1.5px] border-accent rounded-lg max-w-md content-end">
                      <table className="min-w-full border border-accent rounded-lg overflow-hidden !text-sm">
                        <thead className="bg-accent/15">
                          <tr>
                            <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                              Est Sales
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                              Buy Box
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
                            <td className="px-1 py-1.5 text-center text-lText border-r border-accent">{info?.monthlySold ? `${abbreviateNumber(info?.monthlySold)}+/mo` : 'Unknown'}</td>
                            <td className="px-1 py-1.5 text-center text-lText border-r border-accent">{info?.buybox <= 0 ? 'Unknown' : formatNumberWithCommas(info?.buybox)}</td>
                            <td className="px-1 py-1.5 text-center text-lText border-r border-accent">{(info?.sellRank && info?.sellRank >= 0) ? `#${formatNumberWithCommas(info?.sellRank, 0, false, true)}` : 'Unknown'}</td>
                            <td className="px-1 py-1.5 text-center text-lText">
                              {(() => {
                                const totalFees = calculateTotalFees(product, info?.salePrice)?.totalFees || 0;
                                // const maxCost = calculateMaxCost(info?.salePrice, totalFees);
                                const profit = calculateProfit(info?.salePrice, 0, totalFees);
                                return formatNumberWithCommas(profit);
                              })()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className='flex gap-3 items-center'>
                    <ProductActionButtons product={product} className={'!static !w-[30px]'} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col border-[1.5px] border-accent w-[200px] rounded-lg  bg-primary h-[250px]">
              <p className="text-sm py-1 text-center bg-accent text-black font-medium rounded-t-md w-full">
                Top Offers
              </p>

              <div className="w-full grid grid-cols-3 bg-accent/10 backdrop-blur-2xl z-10">
                <p className="py-1.5 text-center text-xs font-medium text-secondary border-r border-accent">Seller</p>
                <p className="py-1.5 text-center text-xs font-medium text-secondary border-r border-accent">Stock</p>
                <p className="py-1.5 text-center text-xs font-medium text-secondary">Price</p>
              </div>
              <div className='flex-1 overflow-auto hideScroll'>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-3 align-middle text-gray-500 bg-primary">
                    <FiLoader className="w-6 h-6 animate-spin mb-2" />
                    <p className="text-sm">Loading Offers...</p>
                  </div>
                ) : (
                  !offers?.length ? (
                    <tr>
                      <td colSpan={3} className="text-center text-lText py-3 align-middle">No offers</td>
                    </tr>
                  ) : (
                    offers?.map((offer, index) => (
                      <div key={index} className="hover:bg-accent/5 transition text-sm text-center text-lText grid grid-cols-3">
                        <p className="px-1 py-1.5 border-r border-accent font-medium">
                          <span
                            data-tooltip-id={`${offer?.sellerInfo?.id}-${index}`}
                            onClick={(e) => redirectForSeller(e, offer?.sellerInfo?.id)}
                            className="cursor-pointer hover:text-secondary/40 "
                          >
                            {offer?.seller}
                          </span>
                        </p>
                        <p className="px-1 py-1.5 border-r border-accent">{offer?.stock || "-"}</p>
                        <p className="px-1 py-1.5">{formatNumberWithCommas(offer?.price)}</p>
                        <Tooltip
                          id={`${offer?.sellerInfo?.id}-${index}`}
                          place="top"
                          className="!bg-secondary !z-[20]  !p-2 !text-[12px] !text-primary !items-center !rounded-md !transition-none !shadow-none "
                          content={
                            <div className="text-left space-y-0.5">
                              <div className="font-medium text-primary mb-1 text-[12px]">{offer?.sellerInfo?.name}</div>
                              <Rating className={'text-[12px]'} count={offer?.sellerInfo?.ratingCount} rating={offer?.sellerInfo?.rating} />
                            </div>
                          }
                        />
                      </div>
                    ))

                  )
                )}
              </div>
            </div>

            <div className='flex flex-col gap-2 items-center h-full bg-white rounded-lg '>
              <div className='w-[450px] h-max overflow-hidden  '>
                <DynamicChart graphData={graphData?.keepaGraphData} graphKeys={SalesGraphKeys} showLegend={false} size='small' syncID={product?.asin} wantsDrag={false}/>
              </div>
              <div className='w-[450px] h-max overflow-hidden  '>
                <DynamicChart graphData={graphData?.keepaGraphData} graphKeys={OfferGraphKeys} showLegend={false} size='small' syncID={product?.asin} wantsDrag={false}/>
              </div>
            </div>
          </div >
        </div >
      </Link>
    </AnimationWrapper >


  )
}

export default ProductCard