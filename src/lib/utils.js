
// Pure helper functions — no Firebase, no React dependencies.

/**
 * Generates a short alphanumeric code for RSVP links.
 * e.g. "abc123x"
 */
export function generateShortCode(length = 7) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

/**
 * Formats a "YYYY-MM-DD" date string into a human-readable string.
 * e.g. "Saturday, 14 June 2025"
 */
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Converts a Firestore Timestamp to a relative "time ago" string.
 */
export function timeAgo(ts) {
  if (!ts) return "";
  const seconds = Math.floor((Date.now() - ts.toMillis()) / 1000);
  if (seconds < 60)    return "just now";
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}


export const buildRSVPLink = (shortCode) => {
  return `${window.location.origin}/rsvp/${shortCode}`;
};

export async function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}


export function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
