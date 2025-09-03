import React, { useEffect, useRef, useState } from 'react';
import Dygraph from 'dygraphs';
import 'dygraphs/dist/dygraph.css';
import { synchronize } from 'dygraphs/dist/extras/synchronizer';
import CustomTooltip from '../UI/Graph/CustomTooltip';

const SalesAndOfferDygraphs = ({ graphData }) => {

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
    const [tooltipData, setTooltipData] = useState({
        x: 0,
        y: 0,
        points: [],
        visible: false,
    });
    // Colors and symbols from Recharts config
    const salesColors = ['#f70cd0dc', '#ff5900dc', '#039BE5', '#299912dc'];
    const salesSymbols = ['', '$', '$', '$', '']; // blank for rank or non-currency
    const offerColors = ['#039BE5'];
    const offerSymbols = ['', ''];

    useEffect(() => {
        if (!graphData || graphData.length === 0) return;

        // Prepare data arrays
        const salesData = graphData.map(d => [
            new Date(d.date),
            d.buyBox,
            d.amazon,
            d.newPrice,
            d.salesRank
        ]);
        const offerData = graphData.map(d => [
            new Date(d.date),
            d.offerCount
        ]);

        // Instantiate Sales Dygraph
        const salesGraph = new Dygraph(salesRef.current, salesData, {
            labels: ["Date", "BuyBox", "Amazon", "New Price", "Sales Rank"],
            // legend: 'never',            // we use custom legend
            animatedZooms: true,
            stepPlot: true,
            gridLinePattern: [5, 5],

            // Axes configuration (dual Y)
            axes: {
                y: {
                    axisLabel: 'Price',
                    valueFormatter: v => '$' + Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 }),
                    axisLabelFormatter: v => '$' + Number(v).toLocaleString()
                },
                y2: {
                    axisLabel: 'Sales Rank',
                    independentTicks: true,
                    valueFormatter: v => Number(v).toLocaleString(),
                    axisLabelFormatter: v => Number(v).toLocaleString()
                }
            },
            series: {
                'Buybox': { strokeWidth: 2 },
                'Amazon': { strokeWidth: 2, fillGraph: true }, // for area
                'New Price': { strokeWidth: 2 },
                'Sales Rank': { axis: 'y2', strokeWidth: 2 }
            },
            legend: 'never',

            colors: salesColors,
            // Grid lines
            drawXGrid: false,
            drawYGrid: true,
            // Reference line at y=39
            underlayCallback: (canvas, area, graph) => {
                const yVal = 39;
                const [x0, y0] = graph.toDomCoords(graph.getValue(0, 0), yVal);
                canvas.save();
                canvas.strokeStyle = 'red';
                canvas.beginPath();
                canvas.moveTo(area.x, y0);
                canvas.lineTo(area.x + area.w, y0);
                canvas.stroke();
                canvas.fillStyle = 'red';
                canvas.fillText("Max PV PAGE", area.x + 5, y0 - 5);
                canvas.restore();
            },
            // Zoom callback to capture range
            zoomCallback: (minX, maxX, yRanges) => {
                const start = new Date(minX).toLocaleDateString();
                const end = new Date(maxX).toLocaleDateString();
                // Here we could set state to update an external label if needed
                console.log(`Sales zoom range: ${start} - ${end}`);
            }
        });

        salesGraph.updateOptions({
            highlightCallback: (event, x, points, row) => {
                setTooltipData({ x: event.clientX, y: event.clientY, points, visible: true });
            },
            unhighlightCallback: () => {
                setTooltipData((prev) => ({ ...prev, visible: false }));
            },
        });


        // Instantiate Offer Dygraph
        const offerGraph = new Dygraph(offerRef.current, offerData, {
            labels: ["Date", "Offer Count"],
            // legend: 'never',
            animatedZooms: true,
            axes: {
                y: {
                    axisLabel: 'Offers',
                    valueFormatter: v => Number(v).toLocaleString(),
                    axisLabelFormatter: v => Number(v).toLocaleString()
                }
            },
            series: {
                'Offers': { strokeWidth: 3 },
            },
            colors: offerColors,
            drawXGrid: false,
            drawYGrid: true,
            zoomCallback: (minX, maxX, yRanges) => {
                const start = new Date(minX).toLocaleDateString();
                const end = new Date(maxX).toLocaleDateString();
                console.log(`Offer zoom range: ${start} - ${end}`);
            }
        });

        // Synchronize the two graphs (zoom/pan and highlight)
        synchronize?.([salesGraph, offerGraph], {
            zoom: true,
            selection: true,
            range: false
        });

        setGSales(salesGraph);
        setGOffer(offerGraph);

        return () => {
            salesGraph.destroy();
            offerGraph.destroy();
        };
    }, [graphData]);

    // Helper to extract the last visible values of each series
    const getLastValues = (graph, labels) => {
        if (!graph) return {};
        const lastIndex = graph.numRows() - 1;
        const vals = {};
        labels.forEach(label => {
            // Dygraph column index: graph.getLabels().indexOf(label)
            const colIndex = graph.getLabels().indexOf(label);
            if (colIndex > 0) { // skip 0 = Date
                const v = graph.getValue(lastIndex, colIndex);
                vals[label] = v != null ? v : "-";
            }
        });
        return vals;
    };


    const salesLabels = ["BuyBox", "Amazon", "New Price", "Sales Rank"];
    const offerLabels = ["Offer Count"];
    const salesLast = getLastValues(gSales, salesLabels);
    const offerLast = getLastValues(gOffer, offerLabels);

    return (
        <div>
            {/* Sales Chart Legend */}
            <ul className="flex gap-4">
                {salesLabels.map((label, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: salesColors[idx] }}></span>
                        <span className="font-medium">
                            {label}: {salesSymbols[idx]}{salesLast[label]?.toLocaleString()}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Sales Graph */}
            <div ref={salesRef} style={{ width: '100%', height: '280px' }} />
            <CustomTooltip {...tooltipData} />

            {/* Offer Chart Legend */}
            <ul className="flex gap-4">
                {offerLabels.map((label, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: offerColors[idx] }}></span>
                        <span className="font-medium">
                            {label}: {offerSymbols[idx]}{offerLast[label]?.toLocaleString()}
                        </span>
                    </li>
                ))}
            </ul>
            {/* Offer Graph */}
            <div ref={offerRef} style={{ width: '100%', height: '280px' }} />
        </div>
    );
};

export default SalesAndOfferDygraphs;






