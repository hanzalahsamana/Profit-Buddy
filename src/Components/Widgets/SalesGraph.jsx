import React from 'react'
import CustomCard from '../UI/CustomCard'
import BASE_URL from '../../../config'
import KeepaChart from '../UI/KeepaStyleGraph'

const SalesGraph = ({ product }) => {
    return (
        <CustomCard label={'Sales Graph'}>
            <div className='flex flex-col gap-3'>

                <KeepaChart graphData={product?.graphData} />
                {/* <div className='w-full '>
                    <img className='object-contain bg-[#ffffffdc] rounded-lg w-full' src={`${BASE_URL}/get/get-graph-image?asin=${product?.asin}`} alt="" />
                </div> */}
            </div>
        </CustomCard>
    )
}

export default SalesGraph