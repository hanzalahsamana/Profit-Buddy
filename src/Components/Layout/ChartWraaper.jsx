import React, { useEffect, useState } from 'react'
import DynamicChart from '../UI/DynamicChart'
import { OfferGraphKeys, SalesGraphKeys } from '../../Enums/Enums'
import Button from '../Controls/Button';
import { getGraphData } from './../../Apis/Graph';
import { isEqual } from 'lodash';
import { toast } from 'react-toastify';
import GraphCardLoader from '../Loaders/GraphCardLoader';
import Example from '../UI/TestChart';
import { LuRefreshCw } from "react-icons/lu";
import SalesAndOfferDygraphs from '../Widgets/SalesAndOfferDygraphs ';

const ChartWraaper = ({ product, size = 'large', className = '' }) => {

    const { asin, historyLength } = product || {}
    const { keepaGraphData } = product?.graphData || {}

    const [graphData, setGraphData] = useState([])
    const [formattedGraphData, setFormattedGraphData] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentFilter, setCurrentFilter] = useState(90)
    const [initialLoad, setInitialLoad] = useState(true)

    useEffect(() => {
        setGraphData(keepaGraphData)
        setFormattedGraphData(keepaGraphData)
    }, [keepaGraphData])

    useEffect(() => {
        if (initialLoad && currentFilter === 90) {
            setInitialLoad(false)
            return
        }

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

    return (
        <div className={`flex flex-col gap-4 w-full ${className}`}>
            <SalesAndOfferDygraphs graphData={formattedGraphData} currentFilter={currentFilter} loading={loading} setCurrentFilter={setCurrentFilter} size={size} totalDays={historyLength} />

            {/* {loading ? (
                <GraphCardLoader />
            ) : (
                <DynamicChart graphData={formattedGraphData || []} graphKeys={SalesGraphKeys} zoom={zoom} />
            )}
            {loading ? (<GraphCardLoader />) : (
                <DynamicChart graphData={formattedGraphData || []} graphKeys={OfferGraphKeys} zoom={zoom} />
            )} */}
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