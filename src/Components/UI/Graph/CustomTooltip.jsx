import React from 'react'

const CustomTooltip = ({ x, y, points, visible }) => {
    if (!visible) return null;

    return (
        <div
            style={{
                position: "fixed",
                left: x + 15,
                top: y + 15,
                pointerEvents: "none",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                zIndex: 1000,
            }}
        >
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
                {new Date(x).toLocaleDateString()}{" "}
                {new Date(x).toLocaleTimeString()}
            </p>
            {points.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span
                        style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: p.color,
                        }}
                    />
                    <span>
                        {p.name}: {p.yval !== null ? p.yval : "-"}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default CustomTooltip