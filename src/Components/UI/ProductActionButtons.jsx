import React from 'react'
import { Tooltip } from 'react-tooltip';

const ProductActionButtons = ({ product , className }) => {

    const { dimension } = product || {}
    return (
        <div>
            <div className={`grid grid-rows-4 gap-2 w-[35px] absolute right-0 bottom-0 ${className}`}>
                <button className='p-1.5 flex items-center justify-center bg-accent/20 border border-accent rounded-md cursor-pointer hover:bg-accent/40' data-tooltip-id='Dimension'>
                    <img src="https://img.icons8.com/dusk/128/tesseract.png" alt="" />
                </button>
                <button
                    className="p-1.5 flex items-center justify-center bg-accent/20 border border-accent rounded-md cursor-pointer hover:bg-accent/40"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
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
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`https://www.amazon.com/dp/${product?.asin}`, "_blank");
                    }}
                >
                    <img src="https://img.icons8.com/color/96/amazon.png" alt="Amazon Search" />
                </button>
                <button className='p-1.5 flex items-center justify-center bg-accent/20 border border-accent rounded-md cursor-not-allowed hover:bg-accent/40'>
                    <img src="https://img.icons8.com/fluency/96/google-sheets--v1.png" alt="" />
                </button>
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
    )
}

export default ProductActionButtons