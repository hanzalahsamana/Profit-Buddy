import React, { useMemo } from "react";
import {
  Line,
  Area,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { generateTicks, getDomainWithPadding, getEvenlySpacedTicks } from "../../Utils/GraphUtils";
import { div } from "framer-motion/client";
import { formatNumberWithCommas } from "../../Utils/NumberUtil";

const DynamicChart = React.memo(({ graphData = [], graphKeys = {}, size = "large", showLegend = true }) => {

  console.log(graphData);


  if (!graphData?.length) return (
    <div className=" w-full !h-full min-h-[150px] flex flex-col gap-0 items-center justify-center bg-primary">
      <p className="font-normal text-lg text-secondary ">Sorry, No Price History Available</p>
      <p className="font-normal text-xs text-lText ">May be this product is new or is not offered by any seller</p>
    </div>
  );

  const { leftKeys, rightKeys, leftMin, leftMax, rightMin, rightMax } = useMemo(() => {
    const leftKeys = Object.keys(graphKeys).filter(
      (key) => graphKeys[key].yAxis === "left"
    );

    const rightKeys = Object.keys(graphKeys).filter(
      (key) => graphKeys[key].yAxis === "right"
    );

    const getDomain = (keys) => {
      if (!keys.length) return [0, 0];

      const values = graphData.flatMap((d) =>
        keys.map((k) => +d[k]).filter((v) => !isNaN(v))
      );

      return getDomainWithPadding(
        values,
        0.1,
        values.length ? values : [0]
      );
    };

    const [leftMin, leftMax] = getDomain(leftKeys);
    const [rightMin, rightMax] = getDomain(rightKeys);

    return { leftKeys, rightKeys, leftMin, leftMax, rightMin, rightMax, };
  }, [graphData, graphKeys]);


  return (
    <div
      className={`bg-white rounded-lg   ${size === "small" ? "w-[150%] h-[180px] scale-[0.65] origin-top-left" : "w-full"} `}
    >
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={graphData} margin={{
          top: 10,
          right: 40,
          left: 0,
          bottom: 10,
        }} >
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <ReferenceLine y={39} stroke="red" label="Max PV PAGE" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            stroke="#000000"
            strokeWidth={2}
            tick={{
              fontSize: size === "small" ? '17px' : '13px',
              fill: "#000000b1",
              fontWeight: "600",
              dx: 5,
              dy: 10,
            }}
            ticks={getEvenlySpacedTicks(graphData, 5)}

          />

          {leftKeys.length > 0 && (
            <YAxis
              yAxisId="left"
              domain={[leftMin, leftMax]}
              ticks={generateTicks(leftMin, leftMax, 4)}
              tickFormatter={(v) => `${graphKeys[leftKeys[0]]?.symbol || ""}${formatNumberWithCommas(v, graphKeys[leftKeys[0]]?.decimal ? 2 : 0, false, true)}`}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: size === "small" ? '17px' : '13px',
                fill: "#000000b1",
                fontWeight: "600"
              }}
              style={{ width: "20px" }}
            />
          )}

          {rightKeys.length > 0 && (
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[rightMin, rightMax]}
              ticks={generateTicks(rightMin, rightMax, 4)}
              tickFormatter={(v) => `${graphKeys[rightKeys[0]]?.symbol || ""}${formatNumberWithCommas(v, graphKeys[rightKeys[0]]?.decimal ? 2 : 0, false, true)}`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: size === "small" ? '17px' : '13px', fill: "#000000b1", fontWeight: "600" }}
            />
          )}

          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload) return null;

              return (
                <div className="bg-white p-2 rounded shadow-md border border-border">
                  <p className="font-semibold mb-1">{label}</p>
                  {payload.map((item, index) => {
                    const key = item.dataKey;
                    const cfg = graphKeys[key];
                    return (
                      <div key={index} className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cfg?.color }}
                        />
                        <span className="text-sm" style={{ color: cfg?.color }}>
                          {cfg?.label}: {cfg?.symbol}{formatNumberWithCommas(item.value, cfg?.decimal ? 2 : 0, false)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          />

          {showLegend && (
            <Legend
              // layout="horizontal"
              align="right"
              verticalAlign="top"
              content={<CustomLegend data={graphData} graphKeys={graphKeys} size={size} />}
            />
          )}

          {Object.keys(graphKeys).map((key) => {
            const cfg = graphKeys[key];
            const Component = cfg.type === "area" ? Area : Line;
            return (
              <Component
                key={key}
                yAxisId={cfg.yAxis || "left"}
                type={cfg.lineType || "stepAfter"}
                dataKey={key}
                stroke={cfg.color}
                fill={cfg.type === "area" ? cfg.color : undefined}
                fillOpacity={cfg.type === "area" ? 0.2 : undefined}
                connectNulls
                dot={false}
                strokeWidth={2}
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
);

function areEqual(prevProps, nextProps) {
  return (
    prevProps.size === nextProps.size &&
    prevProps.showLegend === nextProps.showLegend &&
    prevProps.graphKeys === nextProps.graphKeys &&
    JSON.stringify(prevProps.graphData) === JSON.stringify(nextProps.graphData)
  );
}

export default React.memo(DynamicChart, areEqual);

const CustomLegend = React.memo(({ payload, data, graphKeys, size }) => {
  return (
    <ul className="flex  gap-4 pl-4 pb-10">
      {payload?.map((entry, index) => {
        const dataKey = entry.dataKey;
        return (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: graphKeys?.[dataKey]?.color }}
            />
            <span className={`${size === "small" ? 'text-[15px]' : 'text-[13px]'} text-gray-800 font-medium`}>
              {graphKeys?.[dataKey]?.label}{" "}
              <span>
                : {graphKeys?.[dataKey]?.symbol}
                {formatNumberWithCommas(data[data?.length - 1]?.[dataKey], graphKeys?.[dataKey]?.decimal ? 2 : 0, false) || "-"}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
});
