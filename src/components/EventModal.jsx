

import { useState }           from "react";
import { S }                  from "../lib/theme.js";
import { Icon }               from "./Icons.jsx";
import { EVENT_IMAGES, EVENT_TYPES } from "../constants/eventImages.js";
import { generateShortCode }  from "../lib/utils.js";
import {
  db, collection, doc, addDoc, updateDoc, serverTimestamp,
} from "../lib/firebase.js";

const INITIAL_FORM = (existing) => ({
  name:        existing?.name        || "",
  type:        existing?.type        || EVENT_TYPES[0],
  date:        existing?.date        || "",
  time:        existing?.time        || "",
  location:    existing?.location    || "",
  description: existing?.description || "",
  theme:       existing?.theme       || "",
  guestCount:  existing?.guestCount  || "",
  image:       existing?.image       || EVENT_IMAGES[existing?.type || EVENT_TYPES[0]][0],
});

export const EventModal = ({ user, existing, onClose, onSaved }) => {
  const isEdit = !!existing;
  const [form,   setForm]   = useState(INITIAL_FORM(existing));
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  const images = EVENT_IMAGES[form.type] || EVENT_IMAGES[EVENT_TYPES[0]];

  const handleTypeChange = (type) =>
    setForm((f) => ({ ...f, type, image: EVENT_IMAGES[type][0] }));

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.name || !form.date || !form.location) {
      setErr("Please fill in Event Name, Date, and Location.");
      return;
    }
    setSaving(true);
    setErr("");

    try {
      const payload = {
        name:        form.name,
        type:        form.type,
        date:        form.date,
        time:        form.time,
        location:    form.location,
        description: form.description,
        theme:       form.theme,
        guestCount:  Number(form.guestCount) || 0,
        image:       form.image,
        updatedAt:   serverTimestamp(),
      };

      if (isEdit) {
        await updateDoc(doc(db, "events", existing.id), payload);
        onSaved({ ...existing, ...payload });
      } else {
        const shortCode = generateShortCode();
        const ref = await addDoc(collection(db, "events"), {
          ...payload,
          hostId:    user.uid,
          hostName:  user.displayName,
          hostEmail: user.email,
          shortCode,
          createdAt: serverTimestamp(),
        });
        onSaved({ id: ref.id, ...payload, shortCode, hostId: user.uid });
      }
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(15,23,42,0.6)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...S.card,
          maxWidth: 640, width: "100%",
          maxHeight: "92vh", overflow: "auto",
          padding: 36,
        }}
        onClick={(e) => e.stopPropagation()}
        className="fade-in"
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, color: S.text }}>
            {isEdit ? "Edit Event" : "Create New Event"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: S.textMuted }}><Icon name="close" size={20} /></button>
        </div>

        {/* Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={S.label}>Event Name *</label>
            <input style={S.input} value={form.name} onChange={set("name")} placeholder="e.g. Sarah's Baby Shower" />
          </div>

          <div>
            <label style={S.label}>Event Type *</label>
            <select style={S.input} value={form.type} onChange={(e) => handleTypeChange(e.target.value)}>
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label style={S.label}>Theme / Dress Code</label>
            <input style={S.input} value={form.theme} onChange={set("theme")} placeholder="e.g. Black & Gold" />
          </div>

          <div>
            <label style={S.label}>Date *</label>
            <input type="date" style={S.input} value={form.date} onChange={set("date")} />
          </div>

          <div>
            <label style={S.label}>Time</label>
            <input type="time" style={S.input} value={form.time} onChange={set("time")} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={S.label}>Location *</label>
            <input style={S.input} value={form.location} onChange={set("location")} placeholder="123 Main St, Cape Town" />
          </div>

          <div>
            <label style={S.label}>Expected Guests</label>
            <input type="number" style={S.input} value={form.guestCount} onChange={set("guestCount")} placeholder="50" min="1" />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={S.label}>Description</label>
            <textarea
              style={{ ...S.input, minHeight: 80, resize: "vertical" }}
              value={form.description}
              onChange={set("description")}
              placeholder="Tell your guests what to expect…"
            />
          </div>
        </div>

        {/* Image Picker */}
        <div style={{ marginTop: 20 }}>
          <label style={S.label}>Choose Event Image</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`img-pick${form.image === img ? " selected" : ""}`}
                onClick={() => setForm((f) => ({ ...f, image: img }))}
                style={{
                  width: "100%", aspectRatio: "1", objectFit: "cover",
                  borderRadius: 10, cursor: "pointer",
                  border: "2.5px solid transparent", transition: "all 0.2s",
                }}
              />
            ))}
          </div>
        </div>

        {err && <p style={{ color: S.danger, fontSize: 13, marginTop: 12 }}>{err}</p>}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
          <button onClick={onClose} style={{ ...S.btn, background: S.offWhite, color: S.textMuted, border: `1px solid ${S.border}` }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{ ...S.btn, background: S.grad, color: "white" }}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : <>Create Event <Icon name="sparkles" size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};
