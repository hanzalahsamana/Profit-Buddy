import Rating from '../UI/Rating'
import CopyButton from '../Controls/CopyText'
import CustomCard from '../UI/CustomCard'
import Button from '../Controls/Button'
import { TbExternalLink } from 'react-icons/tb'
import ProductActionButtons from '../UI/ProductActionButtons'

const BasicInfo = ({ product }) => {


    return (
        <CustomCard label={'Basic Info'}>
            <div className='flex gap-4 relative '>
                <div className=''>
                    <img src={product?.images[0]} className=' w-full h-full min-w-[250px] max-w-[250px] aspect-square bg-white rounded-lg  object-contain border border-border' alt="" />
                </div>
                <div>
                    <p className='font-medium text-base/[24px]  tracking-tight'>{product?.title}</p>
                    {/* <p className='text-lText text-xs pt-2'>{product?.category}</p> */}
                    {product?.category && (<p className='text-[14px]/[14px] pt-2 flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>Category:</span>{product?.category}</p>)}
                    {product?.brand && (<p className='text-[14px]/[14px] pt-2 flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>Brand:</span>{product?.brand}</p>)}


                    <Rating rating={product?.reviews?.rating} count={product?.reviews?.count} className={'py-2'} />
                    <a className='text-[14px]/[14px] py-2 flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>ASIN:</span>{product?.asin} <CopyButton text={product?.asin} /></a>
                    <ProductActionButtons product={product} />
                    {/* <Button
                        variant='secondary'
                        corner='full'
                        className='mt-[10px]'
                        action={() => window.open(`/sellerProfile?sellerid=${encodeURIComponent(product?.sellerId?.trim())}`, "_blank")}
                        label={<span className='flex items-center gap-2'>Spy Seller Profile <TbExternalLink /></span>}
                    /> */}
                </div>


            </div>
        </CustomCard>
    )
}

export default BasicInfo