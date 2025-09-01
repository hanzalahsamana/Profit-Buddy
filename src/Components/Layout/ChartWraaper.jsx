import React, { useEffect, useState } from 'react'
import DynamicChart from '../UI/DynamicChart'
import { OfferGraphKeys, SalesGraphKeys } from '../../Enums/Enums'
import Button from '../Controls/Button';
import { getGraphData } from './../../Apis/graph';
import { isEqual } from 'lodash';
import { toast } from 'react-toastify';
import GraphCardLoader from '../Loaders/GraphCardLoader';
import Example from '../UI/TestChart';

const ChartWraaper = ({ keepaGraphData, asin }) => {

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
        <div className='flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <h1 className='text-[24px]/[24px] text-secondary font-semibold fontDmmono'>Price History</h1>
                    {!isEqual(formattedGraphData, graphData) && (<Button action={zoomOut} label='Zoom Out' corner='small' size='small' variant='secondary' className='!px-3' />)}
                </div>
                <div className='flex gap-2 justify-center items-center'>
                    <Button action={() => setCurrentFilter(90)} disabled={loading} label='90 days' corner='small' className={`!px-3 ${currentFilter === 90 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                    <Button action={() => setCurrentFilter(180)} disabled={loading} label='180 days' corner='small' className={`!px-3 ${currentFilter === 180 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                    <Button action={() => setCurrentFilter(365)} disabled={loading} label='1 Year' corner='small' className={`!px-3 ${currentFilter === 365 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                    <Button action={() => setCurrentFilter("all")} disabled={loading} label='Max' corner='small' className={`!px-3 ${currentFilter === "all" && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
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
        isEqual(prevProps.keepaGraphData, nextProps.keepaGraphData)
    )
})