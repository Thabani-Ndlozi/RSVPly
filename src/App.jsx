import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { S } from "./lib/theme.js";
import { useAuth } from "./hooks/useAuth.js";
import { logAnalyticsEvent } from "./lib/firebase.js";
import { GlobalStyles } from "./components/GlobalStyles.jsx";
import { Logo } from "./components/Logo.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { EventsPage } from "./pages/EventsPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { RSVPPage } from "./pages/RSVPPage.jsx";
import { CookieBanner } from "./components/CookieBanner.jsx";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage.jsx";

const LoadingScreen = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: S.gradPage }}>
    <div style={{ textAlign: "center" }}>
      <Logo size={40} />
      <p style={{ color: S.textMuted, marginTop: 16, fontFamily: "'DM Sans', sans-serif" }}>Loading…</p>
    </div>
  </div>
);

const AppShell = ({ user }) => {
  return (
    <div className="app-shell">
      <Navbar user={user} />

      <main className="page-main">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/events" element={<EventsPage user={user} />} />
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  const { user, authReady } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!authReady) return;

    logAnalyticsEvent("app_opened", {
      app_name: "RSVPly",
    });
  }, [authReady]);

  useEffect(() => {
    if (!authReady) return;

    logAnalyticsEvent("page_view", {
      page_path: location.pathname,
      page_name: location.pathname.replace("/", "") || "home",
    });
  }, [location.pathname, authReady]);

  return (
    <>
      <GlobalStyles />

      {!authReady && <LoadingScreen />}

      {authReady && (
        <>
          <Routes>
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/rsvp/:shortCode" element={<RSVPPage />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/*" element={user ? <AppShell user={user} /> : <Navigate to="/login" />} />
          </Routes>

          <CookieBanner />
        </>
      )}
    </>
  );
}