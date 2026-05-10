// src/pages/LoginPage.jsx
// Public sign-in page — Google OAuth only.

import { useState }      from "react";
import { S }             from "../lib/theme.js";
import { Logo }          from "../components/Logo.jsx";
import { GuestNavbar }   from "../components/Navbar.jsx";
import { auth, googleProvider, signInWithPopup } from "../lib/firebase.js";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3c-1.6 4.9-6.3 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 5.7 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.8 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 5.7 29.2 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.1 0 9.8-1.7 13.4-4.6l-6.2-5.2C29.3 35.9 26.8 36 24 36c-4.9 0-9.6-3-11.3-7.8l-6.5 5C9.7 39.7 16.3 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C41.1 35 44 29.9 44 24c0-1.3-.1-2.7-.4-4z"/>
  </svg>
);

export const LoginPage = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState("");

  const handleGoogle = async () => {
    setLoading(true);
    setErr("");
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin?.();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <GuestNavbar />
      <div
        style={{
          flex: 1, display: "flex",
          alignItems: "center", justifyContent: "center",
          padding: 24,
        }}
      >
        <div
  className="fade-in"
  style={{
    ...S.card,
    maxWidth: 440,
    width: "100%",
    padding: 48,
    textAlign: "center", // ✅ centers everything inside
  }}
>
  {/* Logo centered */}
  <div style={{ display: "flex", justifyContent: "center" }}>
    <Logo size={44} />
  </div>

  <h1
    style={{
      fontFamily: "'Sora', sans-serif",
      fontSize: 28,
      fontWeight: 800,
      margin: "24px 0 8px",
      color: S.text,
    }}
  >
    Plan smarter. Host better.
  </h1>

  <p style={{ color: S.textMuted, fontSize: 15, marginBottom: 32 }}>
    Create and manage beautiful events in minutes.
  </p>

  {err && (
    <p style={{ color: S.danger, fontSize: 13, marginBottom: 16 }}>
      {err}
    </p>
  )}

  <button
    onClick={handleGoogle}
    disabled={loading}
    style={{
      ...S.btn,
      width: "100%",
      justifyContent: "center",
      background: S.white,
      border: `1.5px solid ${S.border}`,
      color: S.text,
      fontSize: 15,
      padding: "13px 20px",
    }}
  >
    <GoogleIcon />
    {loading ? "Signing in…" : "Continue with Google"}
  </button>

  <p style={{ marginTop: 24, fontSize: 12, color: S.textLight }}>
    By signing in, you agree to our Terms of Service.
  </p>
</div>
      </div>
    </div>
  );
};
