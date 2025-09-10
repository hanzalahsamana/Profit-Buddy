import React, { useEffect, useRef, useState } from 'react';
import Dygraph from 'dygraphs';
import 'dygraphs/dist/dygraph.css';
import CustomTooltip from '../UI/Graph/CustomTooltip';
import { formatNumberWithCommas } from '../../Utils/NumberUtil';
import { attachTooltipSync, synchronize } from '../../Utils/DygraphSynchronizer';
import Button from '../Controls/Button';
import { LuRefreshCw } from 'react-icons/lu';
import PopupMenu from '../Controls/PopupMenu';
import { IoFilter } from 'react-icons/io5';

const SalesAndOfferDygraphs = ({ graphData, currentFilter, setCurrentFilter, loading, size = 'large', totalDays }) => {

    if (!graphData?.length) return (
        <div className=" w-full border border-border !h-full min-h-[240px] flex flex-col gap-0 items-center justify-center bg-primary">
            <p className="font-normal text-lg text-secondary ">Sorry, No Price and Offer History Available</p>
            <p className="font-normal text-xs text-lText ">May be this product is new or is not offered by any seller</p>
        </div>
    );

    const salesRef = useRef(null);
    const offerRef = useRef(null);
    const [gSales, setGSales] = useState(null);
    const [gOffer, setGOffer] = useState(null);
    const [salesTooltipData, setSalesTooltipData] = useState({ x: 0, y: 0, points: [], visible: false, });
    const [offerTooltipData, setOfferTooltipData] = useState({ x: 0, y: 0, points: [], visible: false, });
    const [isZoomed, setIsZoomed] = useState(false);

    const salesConfig = [
        { name: "Amazon", color: "#ff5900dc", symbol: "$", strokeWidth: 2, decimal: true, fillGraph: true, },
        { name: "New Price", color: "#039BE5", symbol: "$", strokeWidth: 2, decimal: true, },
        { name: "Sales Rank", color: "#8FBC8F", symbol: "#", strokeWidth: 2, decimal: false, axis: "y2" },
        { name: "BuyBox", color: "#f70cd0dc", symbol: "$", strokeWidth: 2, decimal: true, },
    ];

    const offerConfig = [
        { name: "Offer Count", color: "#88d", symbol: "", strokeWidth: 2, decimal: false, },
        // { name: "", color: "", symbol: "", strokeWidth: 2, axis: "y2" },
        // 
        // { name: "Amazon", color: "", symbol: "", strokeWidth: 0 },
    ];

    const resetBothGraphsZoom = () => {
        if (gSales) gSales.resetZoom();
        if (gOffer) gOffer.resetZoom();
        // setIsZoomed(false);
    };


    useEffect(() => {
        if (!graphData || graphData.length === 0) return;


        Dygraph.prototype.doZoomY_ = function (lowY, highY) {
            // no-op: disables Y-axis zoom entirely
        };
        const salesData = graphData.map(d => [
            new Date(d.date),
            d.amazon,
            d.newPrice,
            d.salesRank,
            d.buyBox,
        ]);

        const offerData = graphData.map(d => [
            new Date(d.date),
            d.offerCount,
            // []
        ]);

        let interactionModel = {
            ...Dygraph.defaultInteractionModel,
        };

        if (size === "small") {
            interactionModel = {
                ...Dygraph.defaultInteractionModel,
                mousedown: function (event, g, context) {
                    // block drag-to-zoom
                    if (event.button === 0) {
                        return;
                    }
                },
                mousewheel: function (event, g, context) {
                    // block wheel zoom
                    event.preventDefault();
                },
            };
        }


        const salesGraph = new Dygraph(salesRef.current, salesData, {
            labels: ["Date", ...salesConfig.map(s => s.name)],
            animatedZooms: true,
            // zoomCallback: null,
            interactionModel,
            stepPlot: true,
            gridLinePattern: [5, 5],
            axes: {
                y: {
                    axisLabel: 'Price',
                    axisLabelWidth: 80,
                    axisLabelFontSize: 13,
                    axisLineColor: 'transparent',
                    drawGrid: false,
                    axisLineWidth: 0.1,
                    valueFormatter: v => '$' + formatNumberWithCommas(v) || Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 }),
                    axisLabelFormatter: v => formatNumberWithCommas(v)
                },
                y2: {
                    axisLabel: 'Sales Rank',
                    axisLabelWidth: 80,
                    axisLineColor: 'transparent',
                    axisLineWidth: 0.1,
                    independentTicks: true,
                    valueFormatter: v => '#' + Number(v).toLocaleString(),
                    axisLabelFormatter: v => '#' + Number(v).toLocaleString()
                },
                x: {
                    drawAxis: true,
                    axisLineColor: 'transparent',
                    axisLineWidth: 0.1,
                    axisLabelWidth: 90,
                },
            },
            series: salesConfig.reduce((acc, s) => {
                acc[s.name] = {
                    strokeWidth: s.strokeWidth,
                    fillGraph: s.fillGraph || false,
                    axis: s.axis || 'y'
                };
                return acc;
            }, {}),

            legend: 'never',
            colors: salesConfig.map(s => s.color),
            drawXGrid: false,
            drawYGrid: true,
            drawCallback: (g) => {
                const ctx = g.hidden_ctx_; // canvas context used by dygraphs
                const area = g.getArea();

                ctx.save();
                ctx.strokeStyle = "#dadada";
                ctx.setLineDash([5, 5]);  // dashed pattern
                ctx.lineWidth = 2;
                ctx.strokeRect(area.x, area.y, area.w, area.h);
                ctx.restore();
            },
            // drawCallback: (g) => {
            //     const ctx = g.hidden_ctx_; // canvas context used by dygraphs
            //     const area = g.getArea();

            //     ctx.save();
            //     ctx.strokeStyle = "#dadada";
            //     ctx.setLineDash([5, 5]);  // dashed pattern
            //     ctx.lineWidth = 2;
            //     ctx.strokeRect(area.x, area.y, area.w, area.h);
            //     ctx.restore();
            // },

            // underlayCallback: (ctx, area, g) => {
            //     drawCrosshair(g);
            // }
            // ,
            // highlightCallback: (event, x, points, row, seriesName) => {
            // force redraw so underlayCallback runs
            // points[0].seriesRow.g.updateOptions({});
            // },

            // unhighlightCallback: (event) => {
            //     // clear selection → redraw removes crosshair
            //     event.target.updateOptions({});
            // },

            // zoomCallback: (minX, maxX, yRanges, isInitial) => {
            //     if (setIsZoomed) {
            //         setIsZoomed(!gSales?.isZoomed() && !gOffer?.isZoomed() ? false : true);
            //     }
            // }

        });

        const offerGraph = new Dygraph(offerRef.current, offerData, {
            labels: ["Date", ...offerConfig.map(s => s.name)],
            animatedZooms: true,
            stepPlot: true,
            gridLinePattern: [5, 5],
            rightGap: 90,
            legend: 'never',
            colors: offerConfig.map(s => s.color),
            drawXGrid: false,
            drawYGrid: true,
            drawCallback: (g) => {
                const ctx = g.hidden_ctx_; // canvas context used by dygraphs
                const area = g.getArea();

                ctx.save();
                ctx.strokeStyle = "#dadada";
                ctx.setLineDash([5, 5]);  // dashed pattern
                ctx.lineWidth = 2;
                ctx.strokeRect(area.x, area.y, area.w, area.h);
                ctx.restore();
            },
            // highlightCallback: (event, x, points, row, seriesName) => {
            //     console.log("highlight" , points);
            // },
            // drawCallback: (g) => {
            //     console.log("draw callback");

            // },
            // interactionModel,
            // ticker: Dygraph.numericTicks,
            axes: {
                y: {
                    axisLabel: 'Offers',
                    axisLabelWidth: 80,
                    axisLabelFontSize: 13,
                    axisLineColor: 'transparent',
                    drawGrid: false,
                    axisLineWidth: 0.1,
                    valueFormatter: v => Math.round(v).toLocaleString(),
                    axisLabelFormatter: v => Math.round(v).toLocaleString(),

                    ticker: (min, max, pixels, opts, dygraph, vals) => {
                        const ticks = [];
                        const step = 1;
                        for (let i = Math.ceil(min); i <= Math.floor(max); i += step) {
                            ticks.push({ v: i, label: i.toString() });
                        }
                        return ticks;
                    }
                },
                x: {
                    drawAxis: true,
                    axisLineColor: 'transparent',
                    axisLineWidth: 0.1,
                    axisLabelWidth: 90,
                },
            },
            series: offerConfig.reduce((acc, s) => {
                acc[s.name] = {
                    strokeWidth: s.strokeWidth,
                    fillGraph: s.fillGraph || false,
                    axis: s.axis || 'y'
                };
                return acc;
            }, {}),





        });


        // salesGraph.updateOptions({
        //     highlightCallback: (event, x, points, row) => {
        //         setSalesTooltipData({ x: event.clientX, y: event.clientY, points, visible: true });
        //     },
        //     unhighlightCallback: () => {
        //         setSalesTooltipData((prev) => ({ ...prev, visible: false }));
        //     },
        // });

        // offerGraph.updateOptions({
        //     highlightCallback: (event, x, points, row) => {
        //         setOfferTooltipData({
        //             x: event.clientX,
        //             y: event.clientY,
        //             points,
        //             visible: true,
        //         });
        //     },
        //     unhighlightCallback: () => {
        //         setOfferTooltipData((prev) => ({ ...prev, visible: false }));
        //     },
        // });

        const sync = synchronize([salesGraph, offerGraph], {
            zoom: size !== 'small', // disable zoom sync on small screens
            selection: true,
            range: false,
        }, size === 'small' ? 0.63 : 1);

        attachTooltipSync(
            [salesGraph, offerGraph],
            [setSalesTooltipData, setOfferTooltipData],

        );

        const handleZoom = () => {
            if (!salesGraph || !offerGraph) return;
            const zoomed = salesGraph.isZoomed() || offerGraph.isZoomed();
            setIsZoomed(zoomed);
        };



        salesGraph.updateOptions({ zoomCallback: handleZoom });
        offerGraph.updateOptions({ zoomCallback: handleZoom });

        const totalRows = salesData.length;
        const targetDuration = 1200;
        const intervalTime = 30;
        const batchSize = Math.ceil(totalRows / (targetDuration / intervalTime));
        let i = 0;
        const interval = setInterval(() => {
            if (i >= totalRows) {
                clearInterval(interval);
                return;
            }
            const nextI = Math.min(i + batchSize, totalRows);
            salesGraph.updateOptions({
                file: salesData.slice(0, nextI)
            });
            i = nextI;
        }, intervalTime);

        setGSales(salesGraph);
        setGOffer(offerGraph);

        return () => {
            clearInterval(interval);
            salesGraph.destroy();
            offerGraph.destroy();
            sync.detach();
        };
    }, [graphData]);

    const getLastValues = (graph, labels) => {
        if (!graph) return {};
        const lastIndex = graph.numRows() - 1;
        const vals = {};
        labels.forEach(label => {
            const colIndex = graph.getLabels().indexOf(label);
            if (colIndex > 0) {
                const v = graph.getValue(lastIndex, colIndex);
                vals[label] = v != null ? v : "-";
            }
        });
        return vals;
    };


    const salesLabels = salesConfig?.map((s) => s?.name);
    const offerLabels = offerConfig?.map((s) => s?.name);
    const salesLast = getLastValues(gSales, salesLabels);
    const offerLast = getLastValues(gOffer, offerLabels);

    return (
        <div className='flex flex-col gap-4 w-full'>
            {size !== 'small' && (
                <div className='flex justify-between items-center'>
                    <div className='flex gap-2 items-center'>
                        <h1 className={`text-[24px]/[24px] text-secondary font-semibold fontDmmono`}>Price History</h1>
                    </div>
                    <div className='flex gap-2 justify-center items-center'>
                        {true && (<Button action={resetBothGraphsZoom} label={<LuRefreshCw />} corner='small' size='small' variant='outline' className='!px-3' />)}
                        <div className='2xl:hidden'>
                            <PopupMenu
                                trigger={
                                    <Button label={<div className='flex gap-2 items-center'><IoFilter /> Filters</div>} corner='small' className={`!px-3`} size='small' variant='outline' />
                                }
                                data={[
                                    {
                                        name: '7 days',
                                        action: () => setCurrentFilter(7),
                                        selected: currentFilter === 7,
                                    },
                                    {
                                        name: '30 days',
                                        action: () => setCurrentFilter(30),
                                        selected: currentFilter === 30,
                                    },
                                    {
                                        name: '90 days',
                                        action: () => setCurrentFilter(90),
                                        selected: currentFilter === 90,
                                    },
                                    {
                                        name: '180 days',
                                        action: () => setCurrentFilter(180),
                                        selected: currentFilter === 180,
                                    },
                                    {
                                        name: '1 year',
                                        action: () => setCurrentFilter(365),
                                        selected: currentFilter === 365,
                                    },
                                    {
                                        name: `All (${totalDays ?? ''} Days)`,
                                        action: () => setCurrentFilter('all'),
                                        selected: currentFilter === "all",
                                    },
                                ]}
                            />
                        </div>
                        <div className='hidden 2xl:flex gap-2'>
                            <Button action={() => setCurrentFilter(7)} disabled={loading} label='7 days' corner='small' className={`!px-3 ${currentFilter === 7 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(30)} disabled={loading} label='30 days' corner='small' className={`!px-3 ${currentFilter === 30 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(90)} disabled={loading} label='90 days' corner='small' className={`!px-3 ${currentFilter === 90 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(180)} disabled={loading} label='180 days' corner='small' className={`!px-3 ${currentFilter === 180 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter(365)} disabled={loading} label='1 Year' corner='small' className={`!px-3 ${currentFilter === 365 && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                            <Button action={() => setCurrentFilter("all")} disabled={loading} label={`All (${totalDays ?? ''} Days)`} corner='small' className={`!px-3 ${currentFilter === "all" && !loading ? "!border-accent !text-accent" : ""}`} size='small' variant='outline' />
                        </div>
                    </div>
                </div>
            )}
            <div className='bg-white py-4 rounded-lg'>
                <ul className="hidden sm:flex gap-4 py-2.5 px-6">
                    {salesConfig.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[15px]">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
                            <span className="font-medium text-[#000000b1]">
                                {s.name}: {s.symbol}{salesLast[s.name]?.toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
                <div ref={salesRef} style={{ width: '100%', height: '220px' }} />
                {salesTooltipData.visible && (
                    <CustomTooltip {...salesTooltipData} configs={salesConfig} />
                )}
            </div >
            {size !== 'small' && (
                <h1 className='text-[24px]/[24px] text-secondary font-semibold fontDmmono'>Offer Count</h1>
            )}

            <div className='bg-white py-4 rounded-lg'>

                <ul className="hidden sm:flex gap-4 py-2.5 px-6">
                    {offerConfig.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[15px]">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
                            <span className="font-medium text-[#000000b1]">
                                {s.name}: {s.symbol}{offerLast[s.name]?.toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
                <div ref={offerRef} style={{ width: '100%', height: '220px' }} />
                {offerTooltipData.visible && (
                    <CustomTooltip {...offerTooltipData} configs={offerConfig} />
                )}

            </div>
        </div>
    );
};

export default SalesAndOfferDygraphs;






