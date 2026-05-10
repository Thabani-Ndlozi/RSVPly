

const ICONS = {
  home: "M3 10.8 12 3l9 7.8V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.8Z",
  calendar: "M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
  chart: "M4 19V5M8 17V9M12 17V7M16 17v-5M20 19H4",
  user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
  users: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  check: "M20 6 9 17l-5-5",
  trash: "M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6",
  link: "M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15M14 11a5 5 0 0 0-7.07 0l-2 2A5 5 0 0 0 12 20.07l1.15-1.15",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z",
  star: "m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6-5.4-2.84-5.4 2.84 1.03-6-4.36-4.25 6.03-.88L12 3Z",
  sparkles: "M12 3l1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3ZM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14ZM5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Z",
  mapPin: "M12 21s7-4.9 7-11a7 7 0 1 0-14 0c0 6.1 7 11 7 11Z M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  palette: "M12 3a9 9 0 0 0 0 18h1.5a1.5 1.5 0 0 0 1.1-2.5 1.5 1.5 0 0 1 1.1-2.5H18a6 6 0 0 0 0-12h-6ZM7.5 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM10 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM14 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  arrowRight: "M5 12h14M13 5l7 7-7 7",
  party: "M4 20l4-12 8 8-12 4ZM10 6l8-3M14 10l7-1M16 14l4 4",
  empty: "M9 9h.01M15 9h.01M8 15c1.2-1 2.5-1.5 4-1.5s2.8.5 4 1.5M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  cookie: "M12 2a10 10 0 1 0 10 10 4 4 0 0 1-4-4 4 4 0 0 1-4-4 4 4 0 0 1-2-2z",
};

export const Icon = ({ name, size = 18, strokeWidth = 2, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ display: "inline-block", flexShrink: 0, ...style }}
  >
    <path d={ICONS[name]} />
  </svg>
);
