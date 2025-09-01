import Rating from '../UI/Rating'
import CopyButton from '../Controls/CopyText'
import CustomCard from '../UI/CustomCard'
import Button from '../Controls/Button'
import { TbExternalLink } from 'react-icons/tb'
import ProductActionButtons from '../UI/ProductActionButtons'
import ProductImageGrid from '../UI/ProductImageGrid'
import ScoreChart from '../UI/ScoreChart'
import { abbreviateNumber, formatNumberWithCommas } from '../../Utils/NumberUtil'
import { calculateProfit, calculateTotalFees } from '../../Utils/CalculationUtils'

const BasicInfo = ({ product }) => {

    const { info } = product || {}


    return (
        <CustomCard >
            <div className='flex gap-4 relative '>
                <ProductImageGrid images={product?.images} listPrice={product?.info?.listPrice} />
                {/* <div className=''>
                    <img src={product?.images[0]} className=' w-full h-full min-w-[250px] max-w-[250px] aspect-square bg-white rounded-lg  object-contain border border-border' alt="" />
                </div> */}
                <div className='flex flex-col gap-2'>
                    <p className='font-medium text-base/[24px]  tracking-tight'>{product?.title}</p>
                    <div className='flex items-end h-full gap-2'>
                        <div className='flex flex-1 flex-col gap-3 justify-between h-full'>
                            {product?.category && (<p className='text-[14px]/[14px] flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>Category:</span>{product?.category}</p>)}
                            {product?.brand && (<p className='text-[14px]/[14px] flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>Brand:</span>{product?.brand}</p>)}
                            <Rating rating={product?.reviews?.rating} count={product?.reviews?.count} />
                            <a className='text-[14px]/[14px] flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>ASIN:</span>{product?.asin} <CopyButton text={product?.asin} /></a>
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
                                                    const profit = calculateProfit(info?.salePrice, 0, totalFees);
                                                    return formatNumberWithCommas(profit);
                                                })()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='flex items-end gap-2 '>
                            <ScoreChart />
                            <ProductActionButtons product={product} />
                        </div>
                    </div>
                </div>


            </div>
        </CustomCard>
    )
}

export default BasicInfo