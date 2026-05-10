// src/pages/ProfilePage.jsx
// Shows user info, event stats, 3 most recent events, logout & delete account.

import { useState, useEffect } from "react";
import { S }                   from "../lib/theme.js";
import { Icon }                from "../components/Icons.jsx";
import { formatDate }          from "../lib/utils.js";
import {
  auth, db, signOut,
  deleteUser, collection, query, where, getDocs, writeBatch, logAnalyticsEvent,
} from "../lib/firebase.js";


export const ProfilePage = ({ user, setPage }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "events"), where("hostId", "==", user.uid));
    getDocs(q).then((snap) => {
      // Sort client-side so we don't need an extra composite index here
      const sorted = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
      setEvents(sorted);
      setLoading(false);
    });
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    setPage("login");
  };

const handleDeleteAccount = async () => {
  setDeleting(true);

  try {
    logAnalyticsEvent("delete_account_confirmed", {
      user_id: user.uid,
    });

    const evSnap = await getDocs(
      query(collection(db, "events"), where("hostId", "==", user.uid))
    );

    const batch = writeBatch(db);

    for (const ev of evSnap.docs) {
      batch.delete(ev.ref);

      const gSnap = await getDocs(
        query(collection(db, "guests"), where("eventId", "==", ev.id))
      );

      gSnap.forEach((g) => batch.delete(g.ref));
    }

    await batch.commit();
    await deleteUser(auth.currentUser);
  } catch (e) {
    logAnalyticsEvent("delete_account_failed", {
      user_id: user.uid,
      error_message: e.message,
    });

    alert("Error: " + e.message);
    setDeleting(false);
  }
};

  const recentEvents = events.slice(0, 3);
  const memberSince  = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "–";

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }} className="fade-in">
      <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 30, fontWeight: 800, color: S.text, marginBottom: 24 }}>
        My Profile
      </h1>

      {/* Profile Card */}
      <div style={{ ...S.card, padding: 32, marginBottom: 20, display: "flex", alignItems: "center", gap: 24 }}>
        <img
          src={user.photoURL}
          alt=""
          style={{
            width: 72, height: 72, borderRadius: "50%",
            border: `3px solid ${S.blue}`,
            boxShadow: "0 0 0 4px rgba(14,165,233,0.15)",
          }}
        />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, color: S.text }}>
            {user.displayName}
          </h2>
          <p style={{ color: S.textMuted, fontSize: 14, marginTop: 2 }}>{user.email}</p>
          <p style={{ color: S.textLight, fontSize: 12, marginTop: 6 }}>Member since {memberSince}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ ...S.card, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: 12,
              background: S.gradLight,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: S.blueDark,
            }}
          >
            <Icon name="party" size={24} />
          </div>
          <div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, color: S.text }}>
              {loading ? "–" : events.length}
            </div>
            <div style={{ fontSize: 13, color: S.textMuted, fontWeight: 500 }}>Total Events Created</div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <div style={{ ...S.card, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16, color: S.text }}>
            Recent Events
          </h3>
          {recentEvents.map((ev) => (
            <div
              key={ev.id}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${S.border}` }}
            >
              <img src={ev.image} alt="" style={{ width: 46, height: 46, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.text }}>{ev.name}</p>
                <p style={{ fontSize: 12, color: S.textMuted }}>{ev.type} · {formatDate(ev.date)}</p>
              </div>
              <div
                style={{
                  fontSize: 12, fontWeight: 600,
                  color: S.blue, background: S.blueLight,
                  padding: "3px 10px", borderRadius: 20,
                  whiteSpace: "nowrap",
                }}
              >
                {ev.guestCount || 0} expected
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={() => setShowLogoutModal(true)}
          style={{
            ...S.btn,
            background: S.offWhite, color: S.text,
            border: `1px solid ${S.border}`,
            justifyContent: "center", fontSize: 15, padding: 14,
          }}
        >
          Sign Out
        </button>
        <button
          onClick={() => {
            logAnalyticsEvent("delete_account_clicked", {
              user_id: user.uid,
            });

            setShowDeleteModal(true);
          }}
          disabled={deleting}
          style={{
            ...S.btn,
            background: "transparent", color: S.danger,
            border: `1px solid ${S.danger}33`,
            justifyContent: "center", fontSize: 14, padding: 12,
          }}
        >
          {deleting ? "Deleting…" : "Delete Account & All Data"}
        </button>
      </div>

            {showLogoutModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
        }}>
          <div style={{
            ...S.card,
            padding: 24,
            width: "90%",
            maxWidth: 400,
            textAlign: "center",
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
              Sign Out
            </h3>
            <p style={{ color: S.textMuted, fontSize: 14, marginBottom: 20 }}>
              Are you sure you want to log out?
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  ...S.btn,
                  flex: 1,
                  background: S.offWhite,
                  color: S.text,
                  border: `1px solid ${S.border}`,
                }}
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  await handleLogout();
                }}
                style={{
                  ...S.btn,
                  flex: 1,
                  background: S.blue,
                  color: "white",
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          padding: 20,
        }}>
          <div style={{
            ...S.card,
            padding: 24,
            width: "100%",
            maxWidth: 420,
            textAlign: "center",
          }}>
            <div style={{ color: S.danger, marginBottom: 12 }}>
              <Icon name="trash" size={32} />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: S.text }}>
              Delete Account?
            </h3>

            <p style={{ color: S.textMuted, fontSize: 14, marginBottom: 20 }}>
              This will permanently delete your account, events, and guest data. This action cannot be undone.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                style={{
                  ...S.btn,
                  flex: 1,
                  background: S.offWhite,
                  color: S.text,
                  border: `1px solid ${S.border}`,
                }}
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setShowDeleteModal(false);
                  await handleDeleteAccount();
                }}
                disabled={deleting}
                style={{
                  ...S.btn,
                  flex: 1,
                  background: S.danger,
                  color: "white",
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
