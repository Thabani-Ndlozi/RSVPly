import { S } from "../lib/theme.js";

export const MiniPieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: S.textMuted }}>
        No data yet
      </div>
    );
  }

  let current = 0;

  const gradient = data
    .map((item, index) => {
      const start = (current / total) * 100;
      current += item.value;
      const end = (current / total) * 100;

      const colors = ["#0ea5e9", "#10b981", "#f59e0b"];
      return `${colors[index % colors.length]} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `conic-gradient(${gradient})`,
          flexShrink: 0,
        }}
      />

      <div>
        {data.map((item, index) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: ["#0ea5e9", "#10b981", "#f59e0b"][index % 3],
              }}
            />
            <span style={{ fontSize: 12, color: S.textMuted }}>
              {item.label}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};