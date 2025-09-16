import React from 'react';
import { formatDate, formatYear, lightenColor } from '../../../Utils/GraphUtils';
import { formatNumberWithCommas } from '../../../Utils/NumberUtil';

const CustomTooltip = ({ rect, points, visible, configs }) => {
    if (!visible || !points) return null;
    if (!rect) return null;

    // chart box width/height
    const chartW = rect.width;
    const chartH = rect.height;

    // container is positioned exactly at the chart's top-left
    const containerStyle = {
        position: 'absolute',
        left: Math.round(rect.left + window.scrollX),
        top: Math.round(rect.top + window.scrollY),
        width: Math.round(chartW),
        height: Math.round(chartH),
        pointerEvents: 'none',
        zIndex: 1000,
    };

    return (
        <div style={containerStyle} className="pointer-events-none">
            {/* Header: small floating box at top-left of chart */}
            <div style={{ position: 'absolute', left: 8, top: 8 }} className="bg-white p-2 rounded shadow border">
                <p className='font-semibold text-black'>
                    {formatYear(points?.date)}, {formatDate(points?.date)} :
                    <span className="text-lText font-normal text-xs"> {new Date(points?.date).toLocaleTimeString()}</span>
                </p>
            </div>

            {points?.data.map((p, i) => {
                const px = Math.max(4, Math.min(chartW - 100, Math.round(p.canvasx)));
                const py = Math.max(4, Math.min(chartH - 20, Math.round(p.canvasy)));

                const cfg = configs?.find(c => c.name === p.name) || {};
                const color = cfg.color || '#000';
                const lightColor = cfg.lightColor || '#f8f8f8';

                // Alternate positions to prevent overlap
                const offsetY = (i % 2 === 0 ? -45 : 45);
                const tooltipTop = py + offsetY;

                return (
                    <React.Fragment key={i}>
                        {/* Connector line */}
                        <div
                            style={{
                                position: 'absolute',
                                left: px,
                                top: offsetY > 0 ? py : tooltipTop,
                                height: Math.abs(offsetY),
                                width: '1px',
                                backgroundColor: color,
                            }}
                        />

                        {/* Tooltip box - using your Tailwind classes */}
                        <div
                            className="transition-all duration-100 flex flex-col text-sm p-1 rounded shadow border"
                            style={{
                                position: 'absolute',
                                left: px + 20,
                                top: tooltipTop,
                                background: lightColor,
                                borderColor: color,
                                pointerEvents: 'none',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <span className="text-[#404040] text-sm">
                                {p.name}:
                            </span>
                            <span className="text-[#404040] font-sm">
                                {cfg.symbol || ''}{p.yval !== null ? formatNumberWithCommas(p.yval, cfg?.decimal ? 2 : 0, false, true) : '-'}
                            </span>
                        </div>
                    </React.Fragment>
                );
            })}

        </div>
    );
};

export default CustomTooltip;
