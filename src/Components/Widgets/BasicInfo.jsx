import { CURRENCY } from '../../Enums/Enums'
import { useDispatch, useSelector } from 'react-redux'
import CustomInput from '../Controls/CustomInput'
import Rating from '../UI/Rating'
import CopyButton from '../Controls/CopyText'
import { setBuyCost, setSellPrice } from '../../Redux/Slices/profitCalcSlice'
import CustomCard from '../UI/CustomCard'
import { Tooltip } from 'react-tooltip'
import { Converters } from '../../Utils/NumberUtil'
import Button from '../Controls/Button'
import { TbExternalLink } from 'react-icons/tb'

const BasicInfo = ({ product }) => {
    const dispatch = useDispatch()
    const { buyCost, sellPrice } = useSelector((state) => state.profitCalc);

    const { dimension } = product

    // const formatted = {
    //     width: `${Converters.mmToCm(dimension.width).toFixed(2)} cm (${Converters.mmToInch(dimension.width).toFixed(2)} in)`,
    //     height: `${Converters.mmToCm(dimension.height).toFixed(2)} cm (${Converters.mmToInch(dimension.height).toFixed(2)} in)`,
    //     length: `${Converters.mmToCm(dimension.length).toFixed(2)} cm (${Converters.mmToInch(dimension.length).toFixed(2)} in)`,
    //     weight: `${Converters.gramsToOunce(dimension.weight).toFixed(2)} oz`,
    // };

    return (
        <CustomCard label={'Basic Info'}>
            <div className='flex gap-4 relative '>
                <div className=''>
                    <img src={product?.images[0]} className=' w-full h-full min-w-[250px] max-w-[250px] aspect-square bg-white rounded-lg  object-contain border border-border' alt="" />
                </div>
                <div>
                    <p className='font-medium text-base/[24px]  tracking-tight'>{product?.title}</p>
                    <p className='text-lText text-xs pt-2'>{product?.category}</p>

                    <Rating rating={product?.reviews?.rating} count={product?.reviews?.count} className={'py-2'} />
                    <a className='text-[14px]/[14px] py-2 flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>ASIN:</span>{product?.asin} <CopyButton text={product?.asin} /></a>
                    {/* <div className='flex gap-4 justify-start fontDmmono py-2'>
                        <CustomInput type='number' label={'Buy Cost:'} className={'!w-[120px] !h-[40px]'} prefix={CURRENCY} value={buyCost} onChange={(e) => dispatch(setBuyCost(e.target.value))} min={1} />
                        <CustomInput type='number' label={'Sell Price:'} className={'!w-[120px] !h-[40px]'} prefix={CURRENCY} value={sellPrice} onChange={(e) => dispatch(setSellPrice(e.target.value))} min={1} />
                    </div> */}

                    <div className='grid grid-rows-4 gap-2 w-[35px] absolute right-0 bottom-0 '>
                        <button className='p-1.5 flex items-center justify-center bg-accent/20 border border-accent rounded-md cursor-pointer hover:bg-accent/40' data-tooltip-id='Dimension'>
                            <img src="https://img.icons8.com/dusk/128/tesseract.png" alt="" />
                        </button>
                        <button
                            className="p-1.5 flex items-center justify-center bg-accent/20 border border-accent rounded-md cursor-pointer hover:bg-accent/40"
                            onClick={() => {
                                const query = encodeURIComponent(product.title);
                                window.open(`https://www.google.com/search?q=${query}`, "_blank");
                            }}
                        >
                            <img
                                src="https://img.icons8.com/fluency/96/google-logo.png"
                                alt="Google Search"
                            />
                        </button>
                        <button
                            className="p-1.5 flex items-center justify-center bg-accent/20 border border-accent rounded-md cursor-pointer hover:bg-accent/40"
                            onClick={() => {
                                window.open(`https://www.amazon.com/dp/${product?.asin}`, "_blank");
                            }}
                        >
                            <img src="https://img.icons8.com/color/96/amazon.png" alt="Amazon Search" />
                        </button>
                        <button className='p-1.5 flex items-center justify-center bg-accent/20 border border-accent rounded-md cursor-not-allowed hover:bg-accent/40'>
                            <img src="https://img.icons8.com/fluency/96/google-sheets--v1.png" alt="" />
                        </button>
                    </div>
                    <Button
                        variant='secondary'
                        corner='full'
                        className='mt-[10px]'
                        action={() => window.open(`/sellerProfile?sellerid=${encodeURIComponent(product?.sellerId?.trim())}`, "_blank")}
                        label={<span className='flex items-center gap-2'>Spy Seller Profile <TbExternalLink /></span>}
                    />
                </div>

                <Tooltip
                    id="Dimension"
                    place="left"
                    className="!bg-secondary !backdrop-opacity-100 !max-w-[220px] !p-2 !text-[12px] !text-primary !items-center"
                    content={
                        <div className="text-left space-y-0.5">
                            <div className="font-semibold mb-1 text-[13px]">Dimensions :</div>
                            <div>Width: {dimension?.width || 0}</div>
                            <div>Height: {dimension?.height || 0}</div>
                            <div>Length: {dimension?.length || 0}</div>
                            <div>Weight: {dimension?.weight || 0}</div>
                        </div>
                    }
                />
                <Tooltip
                    id="buttons"
                    place="bottom"
                    className="!bg-secondary !backdrop-opacity-100 !max-w-[220px] !p-2 !text-[12px] !text-secondary !items-center"
                />
            </div>
        </CustomCard>
    )
}

export default BasicInfo