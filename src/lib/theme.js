

export const S = {
  // ── Color Tokens ────────────────────────────────────────────────────────────
  blue:       "#2563eb",
  blueDark:   "#1e40af",
  blueLight:  "#dbeafe",

  teal:       "#0f766e",
  tealLight:  "#ccfbf1",

  white:      "#ffffff",
  offWhite:   "#f8fafc",
  surface:    "#ffffff",
  surfaceAlt: "#f1f5f9",

  border:     "#e2e8f0",
  borderDark: "#cbd5e1",

  text:       "#0f172a",
  textMuted:  "#475569",
  textLight:  "#94a3b8",

  danger:     "#dc2626",
  success:    "#16a34a",
  warning:    "#d97706",

  // ── Gradients ───────────────────────────────────────────────────────────────
  grad:      "linear-gradient(135deg, #2563eb 0%, #0f766e 100%)",

  gradLight: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",

  gradPage:
    "linear-gradient(160deg, #f8fafc 0%, #eef2ff 38%, #f1f5f9 72%, #ffffff 100%)",

  // Background image
  backgroundImage: "url('/background-rsvply.png')",

  // ── Component Presets ───────────────────────────────────────────────────────
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    boxShadow:
      "0 1px 2px rgba(15, 23, 42, 0.05), 0 12px 28px rgba(15, 23, 42, 0.06)",
  },

  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 20px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    transition: "all 0.2s ease",
  },

  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #cbd5e1",
    borderRadius: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 800,
    color: "#475569",
    marginBottom: 6,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
};