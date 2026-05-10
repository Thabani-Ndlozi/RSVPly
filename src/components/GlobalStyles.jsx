

import { S } from "../lib/theme.js";

export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: ${S.gradPage};
      min-height: 100vh;
      color: ${S.text};
    }

    .app-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background:
        linear-gradient(160deg, rgba(240,249,255,0.9) 0%, rgba(224,242,254,0.8) 30%, rgba(248,250,252,0.92) 70%, rgba(240,253,244,0.92) 100%),
        ${S.backgroundImage};
      background-size: cover;
      background-position: center top;
      background-attachment: fixed;
    }

    .page-main { flex: 1; }

    input:focus, select:focus, textarea:focus {
      border-color: ${S.blue} !important;
      box-shadow: 0 0 0 3px rgba(14,165,233,0.12) !important;
    }

    button:active { transform: scale(0.97); }
    button:disabled { opacity: 0.7; cursor: not-allowed; }

    ::-webkit-scrollbar       { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

    .fade-in { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .hover-lift:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(14,165,233,0.14) !important;
    }

    .navbar-shell {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid ${S.border};
    }

    .navbar-inner {
      max-width: 1180px;
      margin: 0 auto;
      padding: 0 32px;
      min-height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }

    .brand-button {
      border: none;
      background: transparent;
      cursor: pointer;
      padding: 0;
      display: inline-flex;
      align-items: center;
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-link {
      text-decoration: none;
      color: ${S.textMuted};
      font-weight: 600;
      font-size: 14px;
      padding: 8px 14px;
      border-radius: 10px;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }
    .nav-link:hover, .nav-link.active { color: ${S.blue}; background: ${S.blueLight}; }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 700;
      color: ${S.text};
      white-space: nowrap;
    }

    .mobile-menu-btn {
      display: none;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 1px solid ${S.border};
      background: ${S.white};
      color: ${S.text};
      cursor: pointer;
      align-items: center;
      justify-content: center;
    }

    .mobile-nav-panel {
      display: none;
      border-top: 1px solid ${S.border};
      padding: 10px 16px 16px;
      background: rgba(255,255,255,0.96);
    }

    .mobile-nav-link {
      width: 100%;
      border: none;
      background: transparent;
      color: ${S.textMuted};
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      text-align: left;
    }
    .mobile-nav-link.active { color: ${S.blue}; background: ${S.blueLight}; }

    .responsive-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .responsive-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }

    .icon-badge {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: ${S.gradLight};
      color: ${S.blueDark};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
    }

    .detail-line {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: ${S.text};
      margin-bottom: 6px;
    }

    .img-pick:hover { border-color: ${S.blue} !important; transform: scale(1.03); }
    .img-pick.selected {
      border-color: ${S.blue} !important;
      box-shadow: 0 0 0 3px rgba(14,165,233,0.25);
    }

    .guest-row:hover { background: ${S.offWhite}; }
    .delete-btn:hover { color: ${S.danger} !important; }

    .tab {
      padding: 8px 18px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 13px;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .tab.active { background: ${S.grad}; color: white; }
    .tab:not(.active) { background: transparent; color: ${S.textMuted}; }
    .tab:not(.active):hover { background: ${S.blueLight}; color: ${S.blue}; }

    .app-footer {
      margin-top: 48px;
      background: rgba(255,255,255,0.88);
      backdrop-filter: blur(16px);
      border-top: 1px solid ${S.border};
      padding: 28px 24px 18px;
    }

    .footer-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: center;
    }

    .footer-brand p {
      color: ${S.textMuted};
      font-size: 13px;
      margin-top: 8px;
      max-width: 360px;
      line-height: 1.6;
    }

    .footer-links {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .footer-links button {
      border: 1px solid ${S.border};
      background: ${S.white};
      color: ${S.textMuted};
      border-radius: 10px;
      padding: 9px 12px;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-weight: 700;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
    }

    .footer-bottom {
      max-width: 1100px;
      margin: 18px auto 0;
      padding-top: 14px;
      border-top: 1px solid ${S.border};
      color: ${S.textLight};
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }

    @media (max-width: 700px) {
  .guest-table-header {
    display: none !important;
  }

  .guest-row {
    border-top: none !important;
    padding: 8px 0 !important;
  }

  .guest-row-desktop {
    display: none !important;
  }

  .guest-row-mobile {
    display: block !important;
  }
}

    @media (max-width: 760px) {
      .navbar-inner { padding: 0 16px; }
      .desktop-nav { display: none; }
      .mobile-menu-btn { display: inline-flex; }
      .mobile-nav-panel { display: block; }
      .user-chip span { display: none; }
      .responsive-grid-3, .responsive-grid-2 { grid-template-columns: 1fr !important; }
      .footer-inner { align-items: flex-start; flex-direction: column; }
      .footer-links { justify-content: flex-start; }
    }

    @media (max-width: 520px) {
      .app-shell { background-attachment: scroll; }
      h1 { font-size: 38px !important; }
      .navbar-inner { gap: 10px; }
    }
  `}</style>
);
