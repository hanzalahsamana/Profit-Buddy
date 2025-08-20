import { Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from "recharts";
import { ProductSearchData } from "../../Utils/MockData";
import { getDomainWithPadding } from "../../Utils/GraphUtils";


const graphKeys = {
  salesRank: { label: 'Sales Rank', symbol: '#', color: "#299912dc" },
  buyBox: { label: 'Buybox', symbol: '$', color: "#f70cd0dc" },
  amazon: { label: 'Amazon', symbol: '$', color: "#ff5900dc" },
  new: { label: 'New', symbol: '$', color: "#a600ffdc" },
};

export default function KeepaChart({ graphData, size = 'large', showLegend = true }) {

  const minValues = graphData?.map(d => {
    const nums = [d.amazon, d.buyBox, d.newFba]
      .map(v => +v)
      .filter(v => !isNaN(v) && v > 0);

    return nums.length ? Math.min(...nums) : null;
  }).filter(v => v !== null);

  const [minPrice, maxPrice] = getDomainWithPadding(graphData?.map(d => Math.max(d.amazon, d.buyBox)), 0.1, minValues);
  const [minSales, maxSales] = getDomainWithPadding(graphData?.map(d => d.salesRank || 0), 0.1, [0]);

  return (

    <div className={`py-4 px-2 bg-white rounded-lg  ${size === 'small' ? 'w-[200%] scale-50 origin-top-left' : 'w-full'}`}>
      <ResponsiveContainer width="100%" height={300} style={{ borderRadius: '8px' }} className={'origin-top-left'}>
        <ComposedChart data={graphData} >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" interval={100} axisLine={false} tickLine={false} tick={{ fontSize: "13px", fill: "#000000b1", fontWeight: '600' }} />
          <YAxis yAxisId="left" domain={[minPrice, maxPrice]} tickFormatter={(value) => `$${value}`} axisLine={false} tickLine={false} tick={{ fontSize: "13px", fill: "#000000b1", fontWeight: '600' }} />
          <YAxis yAxisId="right" orientation="right" domain={[minSales, maxSales]} tickFormatter={(value) => `#${value}`} axisLine={false} tickLine={false} tick={{ fontSize: "13px", fill: "#000000b1", fontWeight: '600' }} />

          <Tooltip labelClassName="text-sm text-black font-semibold" wrapperClassName="text-[10px]/[10px] font-medium " animationDuration={'100'} />

          {!showLegend && (
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="top"
              content={<CustomLegend data={graphData} />}
            />
          )}

          <Area yAxisId="left" type="stepAfter" dataKey="amazon" stroke={graphKeys?.amazon?.color} fill={graphKeys?.amazon?.color} fillOpacity={0.2} connectNulls={true} strokeWidth={2} />
          <Line yAxisId="left" type="stepAfter" dataKey="new" stroke={graphKeys?.new?.color} strokeWidth={2} connectNulls={true} dot={false} />
          <Line yAxisId="right" type="stepAfter" dataKey="salesRank" stroke={graphKeys?.salesRank?.color} strokeWidth={2} connectNulls={true} dot={false} />
          <Line yAxisId="left" type="stepAfter" dataKey="buyBox" stroke={graphKeys?.buyBox?.color} strokeWidth={2} connectNulls={true} dot={false} />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}


const CustomLegend = ({ payload, data }) => {
  function getLastValidValue(data, dataKey) {
    for (let i = data?.length - 1; i >= 0; i--) {
      const value = data[data?.length - 1]?.[dataKey];
      if (value !== null && value !== undefined) {
        return value;
      }
    }
    return null;
  }
  return (
    <ul className="flex flex-col gap-1 pl-4">
      {payload?.map((entry, index) => {
        const dataKey = entry.dataKey;
        // const lastValue = getLastValidValue(data, dataKey);

        return (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: graphKeys?.[dataKey]?.color }}
            ></span>
            <span className="text-sm text-gray-800 font-medium">
              {graphKeys?.[dataKey]?.label}{" "}
              <span className="">: {graphKeys?.[dataKey]?.symbol}{data[data?.length - 1]?.[dataKey] || '-'}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
};