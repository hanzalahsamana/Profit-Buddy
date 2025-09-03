import React from 'react'
import CustomCard from '../UI/CustomCard'
import { formatNumberWithCommas } from '../../Utils/NumberUtil'
import { calculateOfferProfitAndROI, calculateProfitAndROI, calculateTotalFees } from '../../Utils/CalculationUtils'
import { useSelector } from 'react-redux'
import { MIN_PROFIT, MIN_ROI } from '../../Enums/Enums'
import { FiLoader } from 'react-icons/fi'
import { Tooltip } from 'react-tooltip'
import Rating from '../UI/Rating'

const TopOffers = ({ product, productOffers, offerLoading }) => {
    const { buyCost, storageMonth, fulfillment, placementFeeType } = useSelector(
        (state) => state.profitCalc
    );

    return (
        <CustomCard label={"Top Offers"}>
            <div className="w-full">
                <div className="border border-accent customScroll rounded-lg overflow-hidden">
                    {offerLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-primary">
                            <FiLoader className="w-6 h-6 animate-spin mb-2" />
                            <p className="text-sm">Loading Offers...</p>
                        </div>
                    ) : productOffers?.offers?.length > 0 ? (
                        <table className="min-w-full fontDmmono">
                            <thead className="bg-accent/10 sticky top-0 ">
                                <tr>
                                    <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                                        #
                                    </th>
                                    <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                                        Seller
                                    </th>
                                    <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                                        Stock
                                    </th>
                                    <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                                        Price
                                    </th>
                                    <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                                        Profit
                                    </th>
                                    <th className="px-1 py-1.5 text-center font-medium text-secondary">
                                        ROI%
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {productOffers.offers.map((offer, index) => {
                                    const { profit, roi } = calculateOfferProfitAndROI(
                                        product,
                                        offer?.price,
                                        storageMonth,
                                        fulfillment,
                                        buyCost,

                                    );

                                    return (
                                        <tr
                                            key={index}
                                            className="hover:bg-accent/20 bg-accent/5 text-secondary font-light transition "
                                        >
                                            <td className="px-1 py-1.5 text-center border-r border-accent">
                                                {index + 1}
                                            </td>

                                            <td className="px-1 py-1.5 text-center border-r border-accent ">
                                                <span className='cursor-pointer hover:text-accent' data-tooltip-id={offer?.sellerInfo?.id} onClick={() => window.open(`/sellerProfile?sellerid=${encodeURIComponent(offer?.sellerInfo?.id?.trim())}`, "_blank")}>{offer?.seller}</span>
                                            </td>

                                            <td className="px-1 py-1.5 text-center border-r border-accent">
                                                {offer?.stock || "-"}
                                            </td>

                                            <td className="px-1 py-1.5 text-center border-r border-accent">
                                                {formatNumberWithCommas(offer?.price)}
                                            </td>

                                            <td
                                                className={`px-1 py-1.5 text-center font-medium border-r border-accent  
                                                    ${profit < 0
                                                        ? 'text-[red]'
                                                        : profit < MIN_PROFIT
                                                            ? 'text-[orange] '
                                                            : 'text-green-700'
                                                    }`}
                                            >
                                                {formatNumberWithCommas(profit)}
                                            </td>

                                            <td
                                                className={`px-1 py-1.5 text-center font-medium 
                                                  ${profit < 0
                                                        ? 'text-[red]'
                                                        : roi < MIN_ROI
                                                            ? 'text-[orange] '
                                                            : 'text-green-700'
                                                    }`}
                                            >
                                                {formatNumberWithCommas(roi, 2, false, false)}%
                                            </td>

                                            <Tooltip
                                                id={offer?.sellerInfo?.id}
                                                place="top"
                                                opacity={1}
                                                className="!bg-secondary !z-[20] !p-2 !text-[12px] !text-primary !items-center !rounded-md  !shadow-none"
                                                content={
                                                    <div className="text-left space-y-0.5 ">
                                                        <div className="font-semibold text-primary mb-1 text-[12px]">{offer?.sellerInfo?.name}</div>
                                                        <Rating className={'text-[12px] !text-primary'} count={offer?.sellerInfo?.ratingCount} rating={offer?.sellerInfo?.rating} />
                                                    </div>
                                                }
                                            />
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-secondary">
                            <p className="text-sm text-lText ">No offers found</p>
                        </div>
                    )}

                </div>
            </div>
        </CustomCard>
    );
};

export default TopOffers;