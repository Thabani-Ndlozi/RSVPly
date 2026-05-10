import { S } from "../lib/theme.js";

export const PrivacyPolicyPage = () => {
  const sectionStyle = {
    ...S.card,
    padding: 24,
    marginTop: 18,
    border: `1px solid ${S.border}`,
  };

  const headingStyle = {
    fontFamily: "'Sora', sans-serif",
    fontSize: 18,
    fontWeight: 800,
    color: S.text,
    marginBottom: 10,
  };

  const paragraphStyle = {
    color: S.textMuted,
    fontSize: 15,
    lineHeight: 1.8,
  };

  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 12px",
    borderRadius: 999,
    background: S.blueLight,
    color: S.blueDark,
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 16,
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${S.offWhite} 0%, #ffffff 45%)`,
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            ...S.card,
            padding: "38px 32px",
            marginBottom: 24,
            background: S.grad,
            color: "white",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.16)",
              right: -60,
              top: -70,
            }}
          />

          <div
            style={{
              position: "absolute",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              left: -35,
              bottom: -50,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.18)",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              Privacy & Data Protection
            </div>

            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "clamp(30px, 5vw, 44px)",
                fontWeight: 900,
                marginBottom: 10,
              }}
            >
              Privacy Policy
            </h1>

            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                maxWidth: 680,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              This policy explains how we collect, use, store, and protect your
              personal information when you use our event management platform.
            </p>

            <p
              style={{
                marginTop: 18,
                fontSize: 13,
                fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Last updated: 10 May 2026
            </p>
          </div>
        </div>

        {/* Intro Notice */}
        <div
          style={{
            padding: 20,
            borderRadius: 18,
            background: S.blueLight,
            border: `1px solid ${S.blue}22`,
            marginBottom: 24,
          }}
        >
          <p
            style={{
              color: S.blueDark,
              fontSize: 14,
              lineHeight: 1.7,
              fontWeight: 600,
            }}
          >
            We value your privacy. We only collect information needed to create
            events, manage RSVPs, authenticate users, and improve the platform.
          </p>
        </div>

        {/* Sections */}
        <section style={sectionStyle}>
          <span style={badgeStyle}>01</span>
          <h2 style={headingStyle}>Information We Collect</h2>
          <p style={paragraphStyle}>
            We collect personal information that you provide when using our
            platform, including your name, email address, profile photo, event
            details, and guest RSVP information.
          </p>
        </section>

        <section style={sectionStyle}>
          <span style={badgeStyle}>02</span>
          <h2 style={headingStyle}>How We Use Your Information</h2>
          <p style={paragraphStyle}>
            We use your information to create and manage events, allow guests to
            RSVP, display event details, authenticate users, and improve the user
            experience.
          </p>
        </section>

        <section style={sectionStyle}>
          <span style={badgeStyle}>03</span>
          <h2 style={headingStyle}>How We Store Your Information</h2>
          <p style={paragraphStyle}>
            Your information may be stored using Firebase services, including
            Firebase Authentication and Cloud Firestore. We take reasonable steps
            to protect your personal information.
          </p>
        </section>

        <section style={sectionStyle}>
          <span style={badgeStyle}>04</span>
          <h2 style={headingStyle}>Sharing of Information</h2>
          <p style={paragraphStyle}>
            We do not sell your personal information. We may share information
            with trusted service providers only where necessary to operate the
            platform.
          </p>
        </section>

        <section style={sectionStyle}>
            <span style={badgeStyle}>05</span>
            <h2 style={headingStyle}>Cookies and Local Storage</h2>
            <p style={paragraphStyle}>
                We use essential cookies and browser storage to keep the platform working,
                including authentication, account access, and app preferences. With your
                permission, we may also use Google Analytics to understand how users open
                and interact with the platform. You can decline optional analytics cookies
                without affecting the core features of the app.
            </p>
        </section>

        <section style={sectionStyle}>
          <span style={badgeStyle}>06</span>
          <h2 style={headingStyle}>Your Rights</h2>
          <p style={paragraphStyle}>
            You may request access to, correction of, or deletion of your
            personal information. You can also delete your account from your
            profile page.
          </p>
        </section>

        <section
          style={{
            ...sectionStyle,
            background: S.offWhite,
            marginBottom: 30,
          }}
        >
          <span style={badgeStyle}>07</span>
          <h2 style={headingStyle}>Contact Us</h2>
          <p style={paragraphStyle}>
            If you have questions about this Privacy Policy, contact us at:
          </p>

          <a
            href="mailto:info@thabanitechsolutions.co.za"
            style={{
              display: "inline-flex",
              marginTop: 12,
              color: S.blue,
              fontWeight: 800,
              textDecoration: "none",
              fontSize: 15,
            }}
          >
            info@thabanitechsolutions.co.za
          </a>
        </section>
      </div>
    </div>
  );
};