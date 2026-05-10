

import { S } from "../lib/theme.js";

export const Logo = ({ width = 140 }) => (
  <img
    src="/logo.png"
    alt="RSVPly logo"
    style={{
      width,
      height: "auto",
      objectFit: "contain",
      display: "block",
    }}
  />
);