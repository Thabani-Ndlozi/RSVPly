import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { S } from "../lib/theme.js";
import { Icon } from "./Icons.jsx";
import { logAnalyticsEvent } from "../lib/firebase.js";

export const CookieBanner = ({ setPage }) => {
  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");

    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = async () => {
    localStorage.setItem("cookieConsent", "accepted");

    await logAnalyticsEvent("analytics_consent_accepted", {
      consent_type: "optional_analytics",
    });

    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        zIndex: 3000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="fade-in"
        style={{
          ...S.card,
          width: "100%",
          maxWidth: 760,
          padding: 24,
          border: `1px solid ${S.border}`,
          boxShadow: "0 18px 45px rgba(15,23,42,0.2)",
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: S.blueLight,
              color: S.blueDark,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="shield" size={22} />
          </div>

          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: S.text,
                marginBottom: 8,
              }}
            >
              Cookies & Privacy
            </h3>

            <p
              style={{
                fontSize: 14,
                color: S.textMuted,
                lineHeight: 1.7,
                marginBottom: 18,
              }}
            >
              We use essential cookies and browser storage to keep the app working.
              With your permission, we also use Google Analytics to understand how
              users open and interact with the app. You can accept or decline
              optional analytics.
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={acceptCookies}
                style={{
                  ...S.btn,
                  background: S.grad,
                  color: "white",
                  justifyContent: "center",
                }}
              >
                Accept Analytics
              </button>

              <button
                onClick={declineCookies}
                style={{
                  ...S.btn,
                  background: S.offWhite,
                  color: S.text,
                  border: `1px solid ${S.border}`,
                  justifyContent: "center",
                }}
              >
                Decline
              </button>

              <button
                onClick={() => {
                  navigate("/privacy")
                }}
                style={{
                  ...S.btn,
                  background: "transparent",
                  color: S.blue,
                  border: `1px solid ${S.blue}33`,
                  justifyContent: "center",
                }}
              >
                Read Privacy Policy
              </button>
            </div>

            <p
              style={{
                fontSize: 12,
                color: S.textLight,
                marginTop: 14,
                lineHeight: 1.6,
              }}
            >
              Declining analytics will not affect login, RSVP, or event management features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};