import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { S } from "../lib/theme.js";
import { Icon } from "../components/Icons.jsx";
import { GuestNavbar } from "../components/Navbar.jsx";
import { formatDate, isValidEmail } from "../lib/utils.js";
import {
  db, collection, query, where, getDocs, addDoc, serverTimestamp,
} from "../lib/firebase.js";

export const RSVPPage = () => {
  const { shortCode } = useParams();

  const [event,      setEvent]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [notFound,   setNotFound]   = useState(false);
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed,  setConfirmed]  = useState(false);
  const [alreadyReg, setAlreadyReg] = useState(false);
  const [err,        setErr]        = useState("");

  // Look up event by short code
 useEffect(() => {
  const fetchEvent = async () => {
    if (!shortCode) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "events"),
      where("shortCode", "==", shortCode)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      setNotFound(true);
    } else {
      setEvent({ id: snap.docs[0].id, ...snap.docs[0].data() });
    }

    setLoading(false);
  };

  fetchEvent();
}, [shortCode]);

  const handleRSVP = async () => {
  if (!event) {
    setErr("Event could not be loaded. Please refresh and try again.");
    return;
  }

  if (!name.trim() || !email.trim()) {
    setErr("Please enter your name and email.");
    return;
  }

  if (!isValidEmail(email)) {
    setErr("Please enter a valid email address.");
    return;
  }

  setSubmitting(true);
  setErr("");

  try {
    const cleanEmail = email.trim().toLowerCase();

    // Duplicate check
    const dup = await getDocs(
      query(
        collection(db, "guests"),
        where("eventId", "==", event.id),
        where("email", "==", cleanEmail)
      )
    );

    if (!dup.empty) {
      setAlreadyReg(true);
      return;
    }

    await addDoc(collection(db, "guests"), {
      eventId: event.id,
      name: name.trim(),
      email: cleanEmail,
      attended: false,
      registeredAt: serverTimestamp(),
    });

    setConfirmed(true);
  } catch (error) {
  console.error("RSVP error:", error);

  setErr(`RSVP failed: ${error.message}`);
} finally {
    setSubmitting(false);
  }
};

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: S.textMuted }}>Loading event…</p>
    </div>
  );

  return (
    <div className="app-shell">
      <GuestNavbar />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }} className="fade-in">

        {/* Not Found */}
        {notFound && (
          <div style={{ ...S.card, padding: 48, textAlign: "center" }}>
            <div className="icon-badge" style={{ margin: "0 auto 16px" }}><Icon name="empty" size={30} /></div>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Event Not Found</h2>
            <p style={{ color: S.textMuted }}>This link may be invalid or the event has been removed.</p>
          </div>
        )}

        {/* Event Card */}
        {event && (
          <div style={{ ...S.card, overflow: "hidden" }}>
            <img src={event.image} alt={event.name} style={{ width: "100%", height: 260, objectFit: "cover" }} />
            <div style={{ padding: 32 }}>

              {/* Type Badge */}
              <span style={{ fontSize: 12, fontWeight: 600, color: S.blue, background: S.blueLight, padding: "3px 10px", borderRadius: 20 }}>
                {event.type}
              </span>

              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, margin: "14px 0 8px", color: S.text }}>
                {event.name}
              </h1>
              {event.description && (
                <p style={{ color: S.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 18 }}>{event.description}</p>
              )}

              {/* Details */}
              <div style={{ background: S.offWhite, borderRadius: 12, padding: 18, marginBottom: 24 }}>
                <p style={{ fontSize: 14, color: S.text, marginBottom: 6 }}>
                  <Icon name="calendar" size={15} /> <strong>{formatDate(event.date)}</strong>{event.time ? ` at ${event.time}` : ""}
                </p>
                <p className="detail-line"><Icon name="mapPin" size={15} /> {event.location}</p>
                {event.theme      && <p style={{ fontSize: 14, color: S.text, marginBottom: 6 }}><Icon name="palette" size={15} /> Theme: {event.theme}</p>}
                {/* {event.guestCount > 0 && <p style={{ fontSize: 14, color: S.text }}><Icon name="users" size={15} /> {event.guestCount} guests expected</p>} */}
              </div>

              {/* Confirmation Banner */}
              {confirmed && (
                <div style={{ background: "linear-gradient(135deg,#d1fae5,#a7f3d0)", border: "1px solid #6ee7b7", borderRadius: 14, padding: 28, textAlign: "center" }}>
                  <div className="icon-badge" style={{ margin: "0 auto 10px", background: "rgba(255,255,255,0.55)", color: "#065f46" }}><Icon name="party" size={26} /></div>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: "#065f46", marginBottom: 6 }}>
                    You're on the list!
                  </h3>
                  <p style={{ color: "#047857", fontSize: 14 }}>
                    Your RSVP has been confirmed. See you at {event.name}!
                  </p>
                </div>
              )}

              {/* Already Registered */}
              {!confirmed && alreadyReg && (
                <div style={{ background: S.blueLight, border: `1px solid ${S.tealLight}`, borderRadius: 14, padding: 24, textAlign: "center" }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: S.blueDark }}>
                    <Icon name="check" size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} /> You've already registered for this event!
                  </p>
                </div>
              )}

              {/* RSVP Form */}
              {!confirmed && !alreadyReg && (
                <div>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 18, color: S.text }}>
                    RSVP Now
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <label style={S.label}>Your Name *</label>
                      <input
                        style={S.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <label style={S.label}>Email Address *</label>
                      <input
                        type="email"
                        style={S.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                      />
                    </div>
                    {err && <p style={{ color: S.danger, fontSize: 13 }}>{err}</p>}
                    <button
                      onClick={handleRSVP}
                      disabled={submitting}
                      style={{ ...S.btn, background: S.grad, color: "white", justifyContent: "center", fontSize: 16, padding: "13px" }}
                    >
                      {submitting ? "Registering…" : "Confirm My RSVP"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
