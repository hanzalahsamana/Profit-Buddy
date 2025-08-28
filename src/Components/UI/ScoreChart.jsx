"use client";
import { FaSlash } from "react-icons/fa";
import { PieChart, Pie, Cell } from "recharts";

const progress = [
    { name: "Completed", value: 76 },
];

const background = [
    { name: "Full", value: 100 },
];

const COLORS = [
    getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(),
    '#25d89030',
];

export default function ScoreChart() {
    return (
        <div className="flex items-center justify-center ">
            <div className="relative">
                <PieChart width={300} height={300}>
                    <Pie
                        data={background}
                        cx="50%"
                        cy="50%"
                        innerRadius={100}
                        outerRadius={120}
                        startAngle={90}
                        endAngle={-270}
                        cornerRadius={20}
                        dataKey="value"
                    >
                        <Cell fill={COLORS[1]} stroke="none" />
                    </Pie>

                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#24E698" />
                            <stop offset="100%" stopColor="#1DB9A0" />
                        </linearGradient>
                    </defs>
                    <svg>
                        <defs>
                            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" floodColor="#545454" floodOpacity="0.35" />
                                <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#545454" floodOpacity="0.35" />
                            </filter>
                        </defs>
                    </svg>

                    <Pie
                        data={progress}
                        cx="50%"
                        cy="50%"
                        innerRadius={100}
                        outerRadius={120}
                        startAngle={90}
                        endAngle={90 - (progress[0].value / 100) * 360}
                        cornerRadius={20}
                        dataKey="value"
                        filter="url(#shadow)"
                    >
                        <Cell fill="url(#progressGradient)" className="!shadow-xl" strokeWidth={2} stroke="none" />
                    </Pie>
                </PieChart>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-secondary flex items-end ">
                        {progress[0].value / 10}
                        <span className="inline-block rotate-[75deg] relative top-0.5 -mx-2"><FaSlash /></span>
                        <span className="text-3xl relative top-2 ">10</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
