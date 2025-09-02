import { v4 as uuidv4 } from "uuid";
import { formatNumberWithCommas } from "../../Utils/NumberUtil";

const placeholder =
    "https://via.placeholder.com/300?text=No+Image"; // your fallback placeholder

const ProductImageGrid = ({ images = [], listPrice = 0 }) => {
    const hasMainImage = Boolean(images?.[0]);

    let mainImage = hasMainImage ? images[0] : images[0] || placeholder;

    let sideImgs = hasMainImage ? images.slice(1, 4).filter(Boolean) : images.slice(0, 3).filter(Boolean);

    while (sideImgs.length < 3) {
        sideImgs.push(sideImgs[sideImgs.length - 1] || placeholder);
    }

    return (
        <div
            className="grid gap-2   !h-full max-w-[220px] min-w-[220px]"
            style={{
                gridTemplateColumns: "repeat(3, auto)",
                gridTemplateRows: "repeat(3, auto)",
            }}
        >
            {/* {sideImgs.map((img, i) => (
                <div
                    key={uuidv4()}
                    className="aspect-square bg-white border border-border rounded-[8px] p-0.5 overflow-hidden"
                    style={{ gridRowStart: i + 1 }}
                >
                    <img
                        src={img || placeholder}
                        alt={`product-thumbnail-${i + 1}`}
                        className="w-full h-full object-contain rounded-[8px]"
                    />
                </div>
            ))} */}

            <div className="relative  col-span-3 row-span-3 bg-white border border-border rounded-[8px] overflow-hidden p-1">
                <img
                    src={mainImage || placeholder}
                    alt="product"
                    className="object-contain w-full h-full"
                />
                {listPrice > 0 && (
                    <div className="absolute z-20 bottom-1.5 right-1.5 bg-primary px-3 py-1 rounded-md border shadow-xl border-secondary/40  text-base font-medium  text-secondary ">
                        {formatNumberWithCommas(listPrice)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductImageGrid