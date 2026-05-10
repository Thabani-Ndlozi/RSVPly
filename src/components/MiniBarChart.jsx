

import { S } from "../lib/theme.js";

const BAR_COLORS = [
  S.grad,
  "linear-gradient(135deg,#10b981,#34d399)",
  "linear-gradient(135deg,#f59e0b,#fbbf24)",
];

export const MiniBarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div
          key={i}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: S.text }}>{d.value}</span>
          <div
            style={{
              width: "100%",
              height: `${(d.value / max) * 90}px`,
              background: BAR_COLORS[i] || BAR_COLORS[0],
              borderRadius: "6px 6px 0 0",
              minHeight: 4,
              transition: "height 0.5s",
            }}
          />
          <span style={{ fontSize: 11, color: S.textMuted, textAlign: "center", lineHeight: 1.3 }}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
};
