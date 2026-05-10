
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo.jsx";
import { Icon } from "./Icons.jsx";
import { S } from "../lib/theme.js";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo width={118} />
          <p>Simple event creation, RSVP links, and guest tracking in one place.</p>
        </div>

        <div className="footer-links" aria-label="Footer navigation">
          <button type="button" onClick={() => navigate("/")}>
            <Icon name="home" size={16} /> Home
          </button>

          <button type="button" onClick={() => navigate("/events")}>
            <Icon name="calendar" size={16} /> Events
          </button>

          <button type="button" onClick={() => navigate("/dashboard")}>
            <Icon name="chart" size={16} /> Dashboard
          </button>

          <button type="button" onClick={() => navigate("/privacy")}>
            <Icon name="shield" size={16} /> Privacy Policy
          </button>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("cookieConsent");
              window.location.reload();
            }}
          >
            <Icon name="cookie" size={16} /> Cookie Settings
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 RSVPly. All rights reserved.</span>
        <span style={{ color: S.blue }}>Made for effortless event planning.</span>
      </div>
    </footer>
  );
};