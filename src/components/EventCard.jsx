import { S }               from "../lib/theme.js";
import { Icon }            from "./Icons.jsx";
import { formatDate, buildRSVPLink, copyToClipboard } from "../lib/utils.js";

export const EventCard = ({ event, onEdit, onDelete, onShare, onView }) => {
  const link = buildRSVPLink(event.shortCode);

  const handleShare = () => {
    copyToClipboard(link);
    onShare(event);
  };

  return (
    <div
      style={{ ...S.card, overflow: "hidden", transition: "all 0.2s" }}
      className="hover-lift fade-in"
    >
      {/* Cover Image */}
      <div style={{ position: "relative", height: 180 }}>
        <img
          src={event.image}
          alt={event.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <span
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              padding: "4px 10px",
              borderRadius: 20,
              fontSize: 12, fontWeight: 600,
              color: S.blue,
            }}
          >
            {event.type}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "20px 20px 16px" }}>
        <h3
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 18, fontWeight: 700,
            color: S.text, marginBottom: 6,
          }}
        >
          {event.name}
        </h3>
        <p className="detail-line" style={{ color: S.textMuted, marginBottom: 4 }}>
          <Icon name="calendar" size={15} /> {formatDate(event.date)}{event.time ? ` at ${event.time}` : ""}
        </p>
        <p className="detail-line" style={{ color: S.textMuted, marginBottom: 14 }}>
          <Icon name="mapPin" size={15} /> {event.location}
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            onClick={() => onView(event)}
            style={{
              ...S.btn, flex: 1, justifyContent: "center",
              background: S.gradLight, color: S.blueDark,
              border: `1px solid ${S.tealLight}`,
              padding: "8px 12px", fontSize: 13,
            }}
          >
            View
          </button>
          <button
            onClick={() => onEdit(event)}
            style={{
              ...S.btn, flex: 1, justifyContent: "center",
              background: S.offWhite, color: S.textMuted,
              border: `1px solid ${S.border}`,
              padding: "8px 12px", fontSize: 13,
            }}
          >
            Edit
          </button>
          <button
            onClick={handleShare}
            style={{
              ...S.btn, flex: 1, justifyContent: "center",
              background: S.offWhite, color: S.textMuted,
              border: `1px solid ${S.border}`,
              padding: "8px 12px", fontSize: 13,
            }}
          >
            Share <Icon name="link" size={14} />
          </button>
          <button
            onClick={() => onDelete(event)}
            className="delete-btn"
            style={{
              ...S.btn, background: "transparent",
              color: S.textLight, border: "none",
              padding: "8px 10px", fontSize: 16,
            }}
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
