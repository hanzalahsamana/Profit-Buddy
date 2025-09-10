import React from 'react'
import { formatDate, formatYear } from '../../../Utils/GraphUtils';
import { formatNumberWithCommas } from '../../../Utils/NumberUtil';

const CustomTooltip = ({ x, y, points, visible, configs }) => {

    if (!visible) return null;

    return (
        <div
            style={{
                position: "fixed",
                left: x + 15,
                top: y + 15,
            }}
            className='bg-white z-[1000] pointer-events-none p-2 rounded shadow-lg border border-border transition-all duration-100 ease-linear'
        >
            <p className='font-semibold mb-1 text-black'>
                {formatYear(points?.date)}, {formatDate(points?.date)} : <span className="text-lText font-normal text-xs">{new Date(points?.date).toLocaleTimeString()}</span>
            </p>
            {points?.data.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span
                        style={{
                            display: "inline-block",
                            borderRadius: "50%",
                            background: p.color,
                        }}
                    />
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: configs?.find(c => c.name === p.name)?.color }}
                    ></span>
                    <span className='text-sm' style={{ color: configs?.find(c => c.name === p.name)?.color }}>
                        {p.name}: {configs?.find(c => c.name === p.name)?.symbol}{p.yval !== null ? formatNumberWithCommas(p.yval , configs?.find(c => c.name === p.name)?.decimal ? 2 : 0 ,false , true) : "-"}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default CustomTooltip