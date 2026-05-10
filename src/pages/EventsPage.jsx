// src/pages/EventsPage.jsx
// Shows a card grid of the host's events.
// Handles Create, Edit, Delete, Share, and View-detail flows.

import { useState }       from "react";
import { S }              from "../lib/theme.js";
import { Icon }           from "../components/Icons.jsx";
import { useEvents }      from "../hooks/useEvents.js";
import { EventCard }      from "../components/EventCard.jsx";
import { EventModal }     from "../components/EventModal.jsx";
import { formatDate, buildRSVPLink, copyToClipboard } from "../lib/utils.js";
import { db, doc, deleteDoc, getDocs, query, collection, where, writeBatch, logAnalyticsEvent } from "../lib/firebase.js";

export const EventsPage = ({ user }) => {
  const { events, loading } = useEvents(user);
  const [showModal,  setShowModal]  = useState(false);
  const [editEvent,  setEditEvent]  = useState(null);
  const [shareLink,  setShareLink]  = useState("");
  const [viewEvent,  setViewEvent]  = useState(null);
  const [copyLabel,  setCopyLabel]  = useState("Copy");
  const [deleteEvent, setDeleteEvent] = useState(null);
const [deleting, setDeleting] = useState(false);

  const handleDelete = async (ev) => {
  logAnalyticsEvent("delete_event_clicked", {
    event_id: ev.id,
    event_name: ev.name,
    event_type: ev.type || "unknown",
  });

  setDeleteEvent(ev);
};

const confirmDeleteEvent = async () => {
  if (!deleteEvent) return;

  setDeleting(true);

  try {
    await deleteDoc(doc(db, "events", deleteEvent.id));

    const gSnap = await getDocs(
      query(collection(db, "guests"), where("eventId", "==", deleteEvent.id))
    );

    const batch = writeBatch(db);
    gSnap.forEach((d) => batch.delete(d.ref));
    await batch.commit();

    logAnalyticsEvent("delete_event_confirmed", {
      event_id: deleteEvent.id,
      event_name: deleteEvent.name,
      event_type: deleteEvent.type || "unknown",
    });

    setDeleteEvent(null);
  } catch (error) {
    logAnalyticsEvent("delete_event_failed", {
      event_id: deleteEvent.id,
      error_message: error.message,
    });

    alert("Error deleting event: " + error.message);
  } finally {
    setDeleting(false);
  }
};

  const handleShare = (ev) => {
    logAnalyticsEvent("share_event_clicked", {
    event_id: ev.id,
    event_name: ev.name,
    event_type: ev.type || "unknown",
  });

  const link = buildRSVPLink(ev.shortCode);
  setShareLink(link);
};

  const handleCopy = async () => {
    await copyToClipboard(shareLink);

    logAnalyticsEvent("rsvp_link_copied");

    setCopyLabel("Copied!");
    setTimeout(() => {
      setCopyLabel("Copy");
      setShareLink("");
    }, 1500);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }} className="fade-in">

      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 32,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 30, fontWeight: 800, color: S.text }}>
            My Events
          </h1>
          <p style={{ color: S.textMuted, fontSize: 15, marginTop: 4 }}>
            {events.length} event{events.length !== 1 ? "s" : ""} created
          </p>
        </div>

        <button
          onClick={() => { setEditEvent(null); setShowModal(true); }}
          style={{
            ...S.btn,
            background: S.grad,
            color: "white",
            fontSize: "0.95rem",
            padding: "0.8rem 1rem",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          + Create Event
        </button>
      </div>

      {/* States */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 80, color: S.textMuted }}>Loading…</div>
      ) : events.length === 0 ? (
        <div style={{ ...S.card, padding: 64, textAlign: "center" }}>
          <div className="icon-badge" style={{ margin: "0 auto 16px" }}><Icon name="party" size={30} /></div>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>No events yet</h3>
          <p style={{ color: S.textMuted, marginBottom: 24 }}>Create your first event and start collecting RSVPs.</p>
          <button onClick={() => {
              logAnalyticsEvent("create_event_clicked");
              setEditEvent(null);
              setShowModal(true);
            }} style={{ ...S.btn, background: S.grad, color: "white" }}>
            + Create Event
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              onEdit={(e)  => { setEditEvent(e); setShowModal(true); }}
              onDelete={handleDelete}
              onShare={handleShare}
              onView={setViewEvent}
            />
          ))}
        </div>
      )}

      {/* Share Link Modal */}
      {shareLink && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShareLink("")}
        >
          <div
            style={{ ...S.card, padding: 32, maxWidth: 480, width: "100%" }}
            onClick={(e) => e.stopPropagation()}
            className="fade-in"
          >
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Share Event Link</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <input readOnly value={shareLink} style={{ ...S.input, flex: 1, background: S.offWhite, fontSize: 13 }} />
              <button onClick={handleCopy} style={{ ...S.btn, background: S.grad, color: "white", whiteSpace: "nowrap" }}>
                {copyLabel}
              </button>
            </div>
            <p style={{ fontSize: 12, color: S.textMuted, marginTop: 10 }}>Share this link with guests so they can RSVP.</p>
          </div>
        </div>
      )}

      {/* View Event Detail Modal */}
      {viewEvent && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={() => setViewEvent(null)}
        >
          <div
            style={{ ...S.card, maxWidth: 520, width: "100%", overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
            className="fade-in"
          >
            <img src={viewEvent.image} alt="" style={{ width: "100%", height: 220, objectFit: "cover" }} />
            <div style={{ padding: 28 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: S.blue, background: S.blueLight, padding: "3px 10px", borderRadius: 20 }}>
                {viewEvent.type}
              </span>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 800, margin: "12px 0 6px" }}>
                {viewEvent.name}
              </h2>
              {viewEvent.description && (
                <p style={{ color: S.textMuted, fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>{viewEvent.description}</p>
              )}
              <p style={{ fontSize: 14, color: S.text, marginBottom: 4 }}>
                <Icon name="calendar" size={15} /> {formatDate(viewEvent.date)}{viewEvent.time ? ` at ${viewEvent.time}` : ""}
              </p>
              <p className="detail-line"><Icon name="mapPin" size={15} /> {viewEvent.location}</p>
              {viewEvent.theme    && <p style={{ fontSize: 14, color: S.text, marginBottom: 4 }}><Icon name="palette" size={15} /> Theme: {viewEvent.theme}</p>}
              <p style={{ fontSize: 14, color: S.text, marginBottom: 20 }}><Icon name="users" size={15} /> Capacity: {viewEvent.guestCount || "–"} guests</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => copyToClipboard(buildRSVPLink(viewEvent.shortCode))}
                  style={{ ...S.btn, background: S.grad, color: "white", flex: 1, justifyContent: "center" }}
                >
                  Copy RSVP Link <Icon name="link" size={14} />
                </button>
                <button
                  onClick={() => setViewEvent(null)}
                  style={{ ...S.btn, background: S.offWhite, color: S.textMuted, border: `1px solid ${S.border}` }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Event Confirmation Modal */}
{deleteEvent && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 20,
    }}
    onClick={() => !deleting && setDeleteEvent(null)}
  >
    <div
      style={{
        ...S.card,
        padding: 24,
        width: "100%",
        maxWidth: 420,
        textAlign: "center",
      }}
      onClick={(e) => e.stopPropagation()}
      className="fade-in"
    >
      <div style={{ color: S.danger, marginBottom: 12 }}>
        <Icon name="trash" size={32} />
      </div>

      <h3
        style={{
          fontSize: 18,
          fontWeight: 800,
          marginBottom: 10,
          color: S.text,
        }}
      >
        Delete Event?
      </h3>

      <p
        style={{
          color: S.textMuted,
          fontSize: 14,
          marginBottom: 20,
          lineHeight: 1.6,
        }}
      >
        Are you sure you want to delete{" "}
        <strong style={{ color: S.text }}>"{deleteEvent.name}"</strong>? 
        This will also remove all guest RSVP data linked to this event. 
        This action cannot be undone.
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => setDeleteEvent(null)}
          disabled={deleting}
          style={{
            ...S.btn,
            flex: 1,
            background: S.offWhite,
            color: S.text,
            border: `1px solid ${S.border}`,
            justifyContent: "center",
          }}
        >
          Cancel
        </button>

        <button
          onClick={confirmDeleteEvent}
          disabled={deleting}
          style={{
            ...S.btn,
            flex: 1,
            background: S.danger,
            color: "white",
            justifyContent: "center",
          }}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
)}

      {/* Create / Edit Modal */}
      {showModal && (
        <EventModal
          user={user}
          existing={editEvent}
          onClose={() => { setShowModal(false); setEditEvent(null); }}
          onSaved={() => { setShowModal(false); setEditEvent(null); }}
        />
      )}
    </div>
  );
};
