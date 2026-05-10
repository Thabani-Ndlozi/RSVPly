// src/pages/DashboardPage.jsx
// Per-event dashboard: stat cards, guest table, and analytics charts.

import { useState }        from "react";
import { S }               from "../lib/theme.js";
import { Icon }            from "../components/Icons.jsx";
import { useEvents }       from "../hooks/useEvents.js";
import { useGuests }       from "../hooks/useGuests.js";
import { MiniBarChart }    from "../components/MiniBarChart.jsx";
import { MiniPieChart } from "../components/MiniPieChart.jsx";
import { timeAgo }         from "../lib/utils.js";
import { db, doc, updateDoc, deleteDoc } from "../lib/firebase.js";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value }) => (
  <div style={{ ...S.card, padding: 22, display: "flex", alignItems: "center", gap: 16 }}>
    <div
      style={{
        width: 48, height: 48, borderRadius: 12,
        background: S.gradLight,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: S.blueDark, flexShrink: 0,
      }}
    >
      <Icon name={icon} size={24} />
    </div>
    <div>
      <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, color: S.text, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: S.textMuted, marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  </div>
);

// ─── Guest Row ────────────────────────────────────────────────────────────────
const GuestRow = ({ guest, onToggle, onRemove }) => (
  <div
    className="guest-row"
    style={{
      borderTop: `1px solid ${S.border}`,
      padding: "14px 0",
    }}
  >
    {/* Desktop row */}
    <div
      className="guest-row-desktop"
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 2fr 1.5fr auto auto",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ padding: "10px 12px", fontSize: 14, fontWeight: 600, color: S.text }}>
        {guest.name}
      </div>

      <div
        style={{
          padding: "10px 12px",
          fontSize: 13,
          color: S.textMuted,
          overflowWrap: "anywhere",
        }}
      >
        {guest.email}
      </div>

      <div style={{ padding: "10px 12px", fontSize: 12, color: S.textLight }}>
        {guest.registeredAt ? timeAgo(guest.registeredAt) : "–"}
      </div>

      <div style={{ padding: "10px 12px" }}>
        <button
          onClick={() => onToggle(guest)}
          style={{
            ...S.btn,
            padding: "5px 12px",
            fontSize: 12,
            background: guest.attended
              ? "linear-gradient(135deg,#d1fae5,#a7f3d0)"
              : S.offWhite,
            color: guest.attended ? "#065f46" : S.textMuted,
            border: `1px solid ${guest.attended ? "#6ee7b7" : S.border}`,
            whiteSpace: "nowrap",
          }}
        >
          {guest.attended ? (
            <>
              <Icon name="check" size={14} /> Attended
            </>
          ) : (
            "Mark Attended"
          )}
        </button>
      </div>

      <div style={{ padding: "10px 12px" }}>
        <button
          onClick={() => onRemove(guest)}
          className="delete-btn"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: S.textLight,
            fontSize: 16,
            transition: "color 0.2s",
          }}
        >
          <Icon name="trash" size={16} />
        </button>
      </div>
    </div>

    {/* Mobile card */}
    <div
      className="guest-row-mobile"
      style={{
        display: "none",
        background: S.offWhite,
        border: `1px solid ${S.border}`,
        borderRadius: 14,
        padding: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: S.text, marginBottom: 4 }}>
            {guest.name}
          </p>

          <p
            style={{
              fontSize: 13,
              color: S.textMuted,
              overflowWrap: "anywhere",
              lineHeight: 1.5,
            }}
          >
            {guest.email}
          </p>

          <p style={{ fontSize: 12, color: S.textLight, marginTop: 6 }}>
            Registered {guest.registeredAt ? timeAgo(guest.registeredAt) : "–"}
          </p>
        </div>

        <button
          onClick={() => onRemove(guest)}
          className="delete-btn"
          style={{
            background: "white",
            border: `1px solid ${S.border}`,
            cursor: "pointer",
            color: S.textLight,
            width: 34,
            height: 34,
            borderRadius: 10,
            flexShrink: 0,
          }}
        >
          <Icon name="trash" size={15} />
        </button>
      </div>

      <button
        onClick={() => onToggle(guest)}
        style={{
          ...S.btn,
          width: "100%",
          marginTop: 12,
          padding: "9px 12px",
          fontSize: 13,
          justifyContent: "center",
          background: guest.attended
            ? "linear-gradient(135deg,#d1fae5,#a7f3d0)"
            : "white",
          color: guest.attended ? "#065f46" : S.textMuted,
          border: `1px solid ${guest.attended ? "#6ee7b7" : S.border}`,
        }}
      >
        {guest.attended ? (
          <>
            <Icon name="check" size={14} /> Attended
          </>
        ) : (
          "Mark Attended"
        )}
      </button>
    </div>
  </div>
);

// ─── DashboardPage ────────────────────────────────────────────────────────────
export const DashboardPage = ({ user }) => {
  const { events } = useEvents(user);
  const [selectedId, setSelectedId] = useState("");
  const [tab, setTab] = useState("guests");
  const [chartType, setChartType] = useState("bar");
  const [guestToRemove, setGuestToRemove] = useState(null);
  const [removingGuest, setRemovingGuest] = useState(false);

  // Once events load, auto-select the first one
  const resolvedId   = selectedId || (events[0]?.id ?? "");
  const selectedEvent = events.find((e) => e.id === resolvedId);

  const { guests, loading: loadingGuests } = useGuests(resolvedId);

  const expected  = selectedEvent?.guestCount || 0;
  const attending = guests.length;
  const attended  = guests.filter((g) => g.attended).length;

  const toggleAttended = (g) =>
    updateDoc(doc(db, "guests", g.id), { attended: !g.attended });

  const removeGuest = (g) => {
    setGuestToRemove(g);
  };

  const confirmRemoveGuest = async () => {
  if (!guestToRemove) return;

  setRemovingGuest(true);

  try {
    await deleteDoc(doc(db, "guests", guestToRemove.id));
    setGuestToRemove(null);
  } catch (error) {
    alert("Error removing guest: " + error.message);
  } finally {
    setRemovingGuest(false);
  }
};

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }} className="fade-in">

      {/* Header + Event Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 30, fontWeight: 800, color: S.text }}>Dashboard</h1>
          <p style={{ color: S.textMuted, fontSize: 15, marginTop: 4 }}>Manage your events and guests</p>
        </div>
        {events.length > 0 && (
          <select
            value={resolvedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{ ...S.input, width: "auto", minWidth: 220, fontWeight: 600 }}
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Empty state */}
      {events.length === 0 ? (
        <div style={{ ...S.card, padding: 64, textAlign: "center" }}>
          <div className="icon-badge" style={{ margin: "0 auto 16px" }}><Icon name="chart" size={30} /></div>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>No events yet</h3>
          <p style={{ color: S.textMuted }}>Create an event on the Events page to see your dashboard here.</p>
        </div>
      ) : selectedEvent && (
        <>
          {/* Stat Row */}
          <div className="responsive-grid-3" style={{ marginBottom: 24 }}>
            <StatCard icon="users" label="Expected Guests"  value={expected}  />
            <StatCard icon="mail" label="RSVPs Received"   value={attending} />
            <StatCard icon="check" label="Attended"         value={attended}  />
          </div>

          {/* Tabs */}
          <div style={{ ...S.card, padding: 24 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 24, background: S.offWhite, padding: 4, borderRadius: 10, width: "fit-content" }}>
              {["guests", "analytics"].map((t) => (
                <button
                  key={t}
                  className={`tab${tab === t ? " active" : ""}`}
                  onClick={() => setTab(t)}
                  style={{ textTransform: "capitalize" }}
                >
                  {t === "guests" ? <><Icon name="users" size={15} /> Guests ({guests.length})</> : <><Icon name="chart" size={15} /> Analytics</>}
                </button>
              ))}
            </div>

            {/* Guest Table */}
            {tab === "guests" && (
              loadingGuests ? (
                <div style={{ textAlign: "center", padding: 40, color: S.textMuted }}>Loading…</div>
              ) : guests.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div className="icon-badge"><Icon name="empty" size={24} /></div>
                  <p style={{ color: S.textMuted }}>No guests have RSVPed yet.</p>
                  <p style={{ color: S.textLight, fontSize: 13, marginTop: 4 }}>Share the event link to start collecting RSVPs.</p>
                </div>
              ) : (
                <div>
                  {/* Table Header */}
                  <div
                    className="guest-table-header"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 2fr 1.5fr auto auto",
                      marginBottom: 8,
                    }}
                  >
                    {["Name", "Email", "Registered", "Attended", ""].map((h) => (
                      <div key={h} style={{ fontSize: 11, fontWeight: 700, color: S.textMuted, padding: "0 12px 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {h}
                      </div>
                    ))}
                  </div>
                  {guests.map((g) => (
                    <GuestRow key={g.id} guest={g} onToggle={toggleAttended} onRemove={removeGuest} />
                  ))}
                </div>
              )
            )}

            {guestToRemove && (
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
                onClick={() => !removingGuest && setGuestToRemove(null)}
              >
                <div
                  className="fade-in"
                  style={{
                    ...S.card,
                    padding: 24,
                    width: "100%",
                    maxWidth: 420,
                    textAlign: "center",
                  }}
                  onClick={(e) => e.stopPropagation()}
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
                    Remove Guest?
                  </h3>

                  <p
                    style={{
                      color: S.textMuted,
                      fontSize: 14,
                      lineHeight: 1.6,
                      marginBottom: 20,
                    }}
                  >
                    Are you sure you want to remove{" "}
                    <strong style={{ color: S.text }}>
                      {guestToRemove.name}
                    </strong>{" "}
                    from the guest list?
                  </p>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => setGuestToRemove(null)}
                      disabled={removingGuest}
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
                      type="button"
                      onClick={confirmRemoveGuest}
                      disabled={removingGuest}
                      style={{
                        ...S.btn,
                        flex: 1,
                        background: S.danger,
                        color: "white",
                        justifyContent: "center",
                      }}
                    >
                      {removingGuest ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics */}
            {tab === "analytics" && (
            <>
              <div style={{ marginBottom: 18 }}>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  style={{ ...S.input, width: "auto", minWidth: 180 }}
                >
                  <option value="bar">Bar Graph</option>
                  <option value="pie">Pie Chart</option>
                </select>
              </div>

              <div className="responsive-grid-2">
                <div style={{ background: S.offWhite, borderRadius: 14, padding: 24 }}>
                  <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 20, color: S.text }}>
                    Expected vs RSVPs
                  </h4>
                  {chartType === "bar" ? (
                    <MiniBarChart data={[{ label: "Expected", value: expected }, { label: "RSVPs", value: attending }]} />
                  ) : (
                    <MiniPieChart data={[{ label: "Expected", value: expected }, { label: "RSVPs", value: attending }]} />
                  )}
                  <p style={{ fontSize: 12, color: S.textMuted, marginTop: 14, textAlign: "center" }}>
                    {expected > 0
                      ? `${Math.round((attending / expected) * 100)}% response rate`
                      : "Set guest count on the event to see rate"}
                  </p>
                </div>

                <div style={{ background: S.offWhite, borderRadius: 14, padding: 24 }}>
                  <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 20, color: S.text }}>
                    Attended vs Not Attended
                  </h4>
                  {chartType === "bar" ? (
                    <MiniBarChart data={[{ label: "Attended", value: attended }, { label: "Not yet", value: attending - attended }]} />
                  ) : (
                    <MiniPieChart data={[{ label: "Attended", value: attended }, { label: "Not yet", value: attending - attended }]} />
                  )}
                  <p style={{ fontSize: 12, color: S.textMuted, marginTop: 14, textAlign: "center" }}>
                    {attending > 0
                      ? `${Math.round((attended / attending) * 100)}% attendance rate`
                      : "No RSVPs yet"}
                  </p>
                </div>
              </div>
            </>
          )}
          </div>
        </>
      )}
    </div>
  );
};
