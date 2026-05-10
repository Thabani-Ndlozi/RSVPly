// src/pages/HomePage.jsx
// Hero + stats + "how it works" shown after login.

import { useNavigate } from "react-router-dom";
import { S } from "../lib/theme.js";
import { Icon } from "../components/Icons.jsx";

const STATS = [
  { icon: "party", label: "Events Created",  value: "10k+" },
  { icon: "mail", label: "RSVPs Collected", value: "250k+" },
  { icon: "star", label: "Happy Hosts",     value: "8k+" },
];

const HOW_IT_WORKS = [
  {
    n: "01",
    icon: "edit",
    title: "Create Your Event",
    desc: "Fill in your event details, choose a stunning image, and set your guest count in minutes.",
  },
  {
    n: "02",
    icon: "link",
    title: "Share the Link",
    desc: "Get a unique short link automatically generated for your event to send to guests.",
  },
  {
    n: "03",
    icon: "chart",
    title: "Track RSVPs",
    desc: "Watch guests register in real time on your dashboard with live analytics.",
  },
];

export const HomePage = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}
      className="fade-in"
    >
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <h1
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 58,
            fontWeight: 800,
            lineHeight: 1.1,
            color: S.text,
            marginBottom: 20,
            letterSpacing: "-0.03em",
          }}
        >
          Events made
          <br />
          <span
            style={{
              background: S.grad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            effortlessly beautiful
          </span>
        </h1>

        <p
          style={{
            fontSize: 18,
            color: S.textMuted,
            maxWidth: 560,
            margin: "0 auto 36px",
            lineHeight: 1.7,
          }}
        >
          Create events, share unique links, and track your guest list in real time — all from one elegant platform.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate(user ? "/events" : "/login")}
            style={{
              ...S.btn,
              background: S.grad,
              color: "white",
              fontSize: 16,
              padding: "13px 28px",
            }}
          >
            Create an Event <Icon name="arrowRight" size={17} />
          </button>

          {!user && (
            <button
              onClick={() => navigate("/login")}
              style={{
                ...S.btn,
                background: S.white,
                border: `1.5px solid ${S.border}`,
                color: S.text,
                fontSize: 16,
                padding: "13px 28px",
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="responsive-grid-3" style={{ marginBottom: 80 }}>
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{ ...S.card, padding: "28px 24px", textAlign: "center" }}
            className="hover-lift"
          >
            <div className="icon-badge">
              <Icon name={s.icon} size={24} />
            </div>

            <div
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 32,
                fontWeight: 800,
                background: S.grad,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {s.value}
            </div>

            <div style={{ fontSize: 14, color: S.textMuted, marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 36,
            fontWeight: 800,
            color: S.text,
            marginBottom: 12,
          }}
        >
          How it works
        </h2>

        <p style={{ color: S.textMuted, fontSize: 16 }}>
          Three steps to your perfect event
        </p>
      </div>

      <div className="responsive-grid-3">
        {HOW_IT_WORKS.map((step) => (
          <div
            key={step.n}
            style={{
              ...S.card,
              padding: 32,
              position: "relative",
              overflow: "hidden",
            }}
            className="hover-lift"
          >
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 20,
                fontFamily: "'Sora', sans-serif",
                fontSize: 48,
                fontWeight: 800,
                color: S.blueLight,
              }}
            >
              {step.n}
            </div>

            <div className="icon-badge">
              <Icon name={step.icon} size={24} />
            </div>

            <h3
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: S.text,
                marginBottom: 10,
              }}
            >
              {step.title}
            </h3>

            <p
              style={{
                color: S.textMuted,
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};