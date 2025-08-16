import React from 'react'
import Rating from './Rating'
import { formatNumber } from '../../Utils/formatNumber'
import CopyButton from '../Controls/CopyText'
import BASE_URL from '../../../config'

const ProductCard = ({ product }) => {
  return (
    <div className='flex md:items-center justify-between flex-col items-start md:flex-row gap-4 md:gap-7 p-3 border border-border rounded-[18px] bg-primary transition-all hover:opacity-85 cursor-pointer hover:scale-[1.01]'>
      <div className='flex gap-4'>

        <div className='flex flex-col gap-2 w-[60px]'>
          {(() => {
            const imgs = product?.images?.slice(1, 4).filter(Boolean) || [];
            while (imgs.length < 3 && imgs.length > 0) {
              imgs.push(imgs[imgs.length - 1]);
            }
            return imgs.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`product-thumbnail-${i + 1}`}
                className='object-contain p-1 max-w-[60px] min-w-[60px] max-h-[60px] min-h-[60px] bg-white rounded-lg'
              />
            ));
          })()}
        </div>
        <div className='aspect-square min-w-[200px] bg-white max-w-[200px]  border border-border rounded-[8px] overflow-hidden p-2'>
          <img src={product?.images[0]} className='object-contain w-full h-full' />
        </div>
        <div>
          <p className='text-secondary py-2 text-sm'>{product?.title}</p>
          <p className='text-lText text-xs pb-2'>{product?.category}</p>
          {/* <a className='text-accent text-[12px]/[12px] pb-2 flex items-end gap-1 cursor-pointer'>See On Amazon<RiExternalLinkLine className='text-sm' /></a> */}
          <a className='text-[14px]/[14px] pb-2 flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>ASIN:</span>{product?.asin} <CopyButton text={product.asin} /></a>
          <Rating rating={product?.reviews?.rating / 10} count={product?.reviews?.count} />
          <p className='py-2'><span className='text-lText'>Sale Price:</span><span className='fontDmmono text-secondary text-lg pl-2 font-medium'>${formatNumber(product?.info?.sellPrice / 100)}</span></p>

        </div>
      </div>

      <div className='min-w-[400px] max-w-[400px] h-full '>
        <img className='object-contain rounded-[10px]' src={`${BASE_URL}/get/get-graph-image?asin=${product?.asin}`} alt="" />
      </div>
    </div>
  )
}

export default ProductCard