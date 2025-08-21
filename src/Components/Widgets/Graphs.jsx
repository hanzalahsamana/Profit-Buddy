import { OfferGraphKeys, SalesGraphKeys } from '../../Enums/Enums';
import CustomCard from '../UI/CustomCard'
import DynamicChart from '../UI/DynamicChart'

const Graphs = ({ product = {} }) => {
    const { graphData } = product || {};


    return (
        <CustomCard label={'Graphs'}>
            <div className='flex flex-col gap-3'>

                <DynamicChart graphData={graphData?.salesGraph} graphKeys={SalesGraphKeys} />
                <DynamicChart graphData={graphData?.offerGraph} graphKeys={OfferGraphKeys} />
                {/* <div className='w-full '>
                    <img className='object-contain bg-[#ffffffdc] rounded-lg w-full' src={`${BASE_URL}/get/get-graph-image?asin=${product?.asin}`} alt="" />
                </div> */}
            </div>
        </CustomCard>
    )
}

export default Graphs