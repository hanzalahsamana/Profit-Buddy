import React, { useEffect, useState } from 'react'
import DynamicChart from '../UI/DynamicChart'
import { OfferGraphKeys, SalesGraphKeys } from '../../Enums/Enums'
import Button from '../Controls/Button';
import { getGraphData } from './../../Apis/graph';
import { isEqual } from 'lodash';
import { toast } from 'react-toastify';
import GraphCardLoader from '../Loaders/GraphCardLoader';
import Example from '../UI/TestChart';
import { LuRefreshCw } from "react-icons/lu";

const ChartWraaper = ({ keepaGraphData, asin, size = 'large', className = '' }) => {

    const [graphData, setGraphData] = useState([])
    const [formattedGraphData, setFormattedGraphData] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentFilter, setCurrentFilter] = useState('')

    useEffect(() => {
        setGraphData(keepaGraphData)
        setFormattedGraphData(keepaGraphData)
    }, [keepaGraphData])

    useEffect(() => {
        handleFilterDays()
    }, [currentFilter])

    const handleFilterDays = async () => {
        if (!currentFilter || loading) return

        try {
            setLoading(true)
            const response = await getGraphData(asin, currentFilter)
            setGraphData(response?.keepaGraphData)
            setFormattedGraphData(response?.keepaGraphData)
        } catch (error) {
            toast.error("Error occuring while fetching graph data")
        } finally {
            setLoading(false)
        }

    }

    const zoom = (startDate, endDate) => {
        if (startDate === endDate || endDate === '') return
        let [left, right] = startDate < endDate ? [startDate, endDate] : [endDate, startDate];

        const filtered = graphData.filter(
            (item) => item.date >= left && item.date <= right
        );

        setFormattedGraphData(filtered);
    };

    const zoomOut = () => {
        setFormattedGraphData(graphData)
    };

    return (
        <div className={`flex flex-col gap-4 w-full ${className}`}>
            <div className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <h1 className='text-[24px]/[24px] text-secondary font-semibold fontDmmono'>Price History</h1>
                </div>
                <div className='flex gap-2 justify-center items-center'>
                    {!isEqual(formattedGraphData, graphData) && (<Button action={zoomOut} label={<LuRefreshCw />} corner='small' size='small' variant='outline' className='!px-3' />)}
                    {size !== 'small' && (
                        <>
                            <Button action={() => setCurrentFilter(7)} disabled={loading} label='7 days' corner='small' className={`!px-3 ${currentFilter === 7 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(30)} disabled={loading} label='30 days' corner='small' className={`!px-3 ${currentFilter === 30 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(90)} disabled={loading} label='90 days' corner='small' className={`!px-3 ${currentFilter === 90 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(180)} disabled={loading} label='180 days' corner='small' className={`!px-3 ${currentFilter === 180 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(365)} disabled={loading} label='1 Year' corner='small' className={`!px-3 ${currentFilter === 365 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter("all")} disabled={loading} label='All Days' corner='small' className={`!px-3 ${currentFilter === "all" && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                        </>
                    )}
                </div>
            </div>

            {loading ? (
                <GraphCardLoader />
            ) : (
                <DynamicChart graphData={formattedGraphData || []} graphKeys={SalesGraphKeys} zoom={zoom} />
            )}
            <h1 className='text-[24px]/[24px] text-secondary font-semibold fontDmmono'>Offer Count</h1>
            {loading ? (<GraphCardLoader />) : (
                <DynamicChart graphData={formattedGraphData || []} graphKeys={OfferGraphKeys} zoom={zoom} />
            )}
        </div>
    )
}

export default React.memo(ChartWraaper, (prevProps, nextProps) => {
    return (
        prevProps.asin === nextProps.asin &&
        prevProps.size === nextProps.size &&
        prevProps.className === nextProps.className &&
        isEqual(prevProps.keepaGraphData, nextProps.keepaGraphData)
    )
})