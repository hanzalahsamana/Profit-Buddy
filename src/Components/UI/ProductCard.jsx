import { useEffect, useState } from 'react'
import Rating from './Rating'
import CopyButton from '../Controls/CopyText'
import { formatNumberWithCommas } from '../../Utils/NumberUtil'
import { calculateEstimatSellerAsinRevenue, calculateMaxCost, calculateProfit, calculateTotalFees } from '../../Utils/CalculationUtils'
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
import ChartWraaper from '../Layout/ChartWraaper'


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
        <div className='p-3 rounded-[10px] bg-primary transition-shadow cursor-pointer productCardShadow border-border border'>
          <div className='flex gap-2 md:gap-3  lg:flex-nowrap flex-wrap w-full items-center '>
            <div className='flex flex-1 gap-2 w-full col-span-4 relative h-[260px]'>
              <ProductImageGrid images={images} listPrice={info?.listPrice} />

              <div className='flex flex-col flex-1 justify-evenly gap-3'>
                <p className="text-secondary font-semibold text-sm/[20px] capitalize tracking-tight line-clamp-2" title={product?.title}>
                  {product?.title}
                </p>
                <div className='flex items-end gap-2.5'>
                  <div className='flex flex-1 flex-col gap-3  justify-between  '>
                    <div className='flex flex-wrap gap-2 items-end'>
                      {product?.category && (<p className='text-[14px]/[14px] capitalize flex items-end gap-1 text-secondary font-medium'><span className='text-lText text-[14px]/[14px]'>Category:</span>{product?.category}</p>)}
                      <span className='text-lText text-[14px]/[14px]'>||</span>
                      {product?.brand && (<p className='text-[14px]/[14px] capitalize flex items-end gap-1 text-secondary font-medium'><span className='text-lText text-[14px]/[14px]'>Brand:</span>{product?.brand}</p>)}
                    </div>
                    {/* {product?.category && (<p className='text-[14px]/[14px] flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>Category:</span>{product?.category}</p>)} */}
                    {/* {product?.brand && (<p className='text-[14px]/[14px] flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>Brand:</span>{product?.brand}</p>)} */}
                    <Rating rating={reviews?.rating} count={reviews?.count} />
                    <p className='text-[14px]/[14px] flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>ASIN:</span>{product?.asin} <CopyButton text={product.asin} /></p>
                    {calculateEstimatSellerAsinRevenue(product) > 0 && (
                      <div className='flex flex-col items-start gap-1.5'>
                        <p className='text-[22px]/[22px] flex items-end gap-1 font-semibold text-secondary'>{formatNumberWithCommas(calculateEstimatSellerAsinRevenue(product))}</p>
                        <p className='text-lText font-medium text-[14px]/[14px] tracking-tight'>Est Product Rev</p>
                      </div>
                    )}
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
                            <td className="px-1 py-1.5 text-center text-lText border-r border-accent">{info?.buybox <= 0 ? 'Surpressed BB' : formatNumberWithCommas(info?.buybox)}</td>
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

            <div className="flex flex-col border-[1.5px] border-accent w-[200px] rounded-lg bg-accent/5 h-[260px]">
              <p className="text-sm py-1 text-center bg-accent text-black font-medium rounded-t-md w-full">
                Top Offers
              </p>

              <div className="w-full grid grid-cols-3 bg-accent/10 backdrop-blur-2xl z-10">
                <p className="py-1.5 text-center text-xs font-medium text-secondary border-r border-accent">Seller</p>
                <p className="py-1.5 text-center text-xs font-medium text-secondary border-r border-accent">Stock</p>
                <p className="py-1.5 text-center text-xs font-medium text-secondary">Price</p>
              </div>
              <div className='flex-1 overflow-auto hideScroll '>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-3 align-middle text-gray-500 bg-transparent">
                    <FiLoader className="w-6 h-6 animate-spin mb-2" />
                    <p className="text-sm">Loading Offers...</p>
                  </div>
                ) : (
                  !offers?.length ? (
                    <div>
                      <p className="text-center text-lText py-3 align-middle ">No offers</p>
                    </div>
                  ) : (
                    offers?.map((offer, index) => (
                      <div key={index} className="bg-transparent hover:bg-accent/10 transition text-sm text-center text-lText grid grid-cols-3 ">
                        <p className="px-1 py-1.5 border-r border-accent font-medium">
                          <span
                            data-tooltip-id={`${offer?.sellerInfo?.id}-${index}`}
                            onClick={(e) => redirectForSeller(e, offer?.sellerInfo?.id)}
                            className="cursor-pointer hover:text-accent "
                          >
                            {offer?.seller}
                          </span>
                        </p>
                        <p className="px-1 py-1.5 border-r border-accent">{offer?.stock || "-"}</p>
                        <p className="px-1 py-1.5">{formatNumberWithCommas(offer?.price)}</p>
                        <Tooltip
                          id={`${offer?.sellerInfo?.id}-${index}`}
                          place="top"
                          opacity={1}
                          className="!bg-secondary !z-[20]  !p-2 !text-[12px] !text-primary !items-center !rounded-md !shadow-none "
                          content={
                            <div className="text-left space-y-0.5">
                              <div className="font-medium text-primary mb-1 text-[12px]">{offer?.sellerInfo?.name}</div>
                              <Rating className={'text-[12px] !text-primary'} count={offer?.sellerInfo?.ratingCount} rating={offer?.sellerInfo?.rating} />
                            </div>
                          }
                        />
                      </div>
                    ))
                  )
                )}
              </div>
            </div>

            <div onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();
            }} className='flex  gap-0 pl-[10px] max-w-[500px] max-h-[450px] overflow-hidden items-start h-full  rounded-lg '>

              <div className='max-w-[750px] min-w-[750px] w-[750px] h-max overflow-hidden flex items-end  justify-end  '>
                <ChartWraaper product={product} className='scale-[0.63] origin-top-left' size='small' />
              </div>
              {/* <div className='w-[450px] h-max overflow-hidden  '>
                <DynamicChart graphData={graphData?.keepaGraphData} graphKeys={SalesGraphKeys} showLegend={false} size='small' syncID={product?.asin} wantsDrag={false} />
              </div>
              <div className='w-[450px] h-max overflow-hidden  '>
                <DynamicChart graphData={graphData?.keepaGraphData} graphKeys={OfferGraphKeys} showLegend={false} size='small' syncID={product?.asin} wantsDrag={false} />
              </div> */}
            </div>
          </div >
        </div >
      </Link>
    </AnimationWrapper >


  )
}

export default ProductCard