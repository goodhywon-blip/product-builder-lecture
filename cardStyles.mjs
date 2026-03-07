export const CARD_STYLES = {
  honorary: {
    id: "honorary",
    label: "Honorary ID",
    note: "Original honorary ID design with ornate Korean motif.",
    backgroundImage: "assets/honorary_id_bg.png",
    vars: {
      "--card-max-width": "640px",
      "--card-aspect-ratio": "85.6 / 54",
      "--card-text-left": "8%",
      "--card-text-right": "8%",
      "--card-text-bottom": "18%",
      "--card-text-top": "auto",
      "--card-text-transform": "none",
      "--card-text-align": "left",
      "--card-text-max-width": "none",
      "--card-hangul-size": "clamp(24px, 4.2vw, 33px)",
      "--card-hangul-color": "#3b2f20",
      "--card-english-size": "clamp(10px, 1.6vw, 13px)",
      "--card-english-color": "#5f4c34",
      "--card-brand-left": "8%",
      "--card-brand-top": "10%",
      "--card-brand-transform": "none",
      "--card-brand-color": "#5f4c34",
      "--card-tone": "linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.08))"
    }
  },
  classic: {
    id: "classic",
    label: "Classic",
    note: "Soft ivory style for timeless everyday use.",
    backgroundImage: "assets/cards/classic-template.jpg",
    vars: {
      "--card-max-width": "360px",
      "--card-aspect-ratio": "383 / 626",
      "--card-text-left": "12%",
      "--card-text-right": "12%",
      "--card-text-bottom": "auto",
      "--card-text-top": "48%",
      "--card-text-transform": "translateY(-50%)",
      "--card-text-align": "center",
      "--card-text-max-width": "76%",
      "--card-hangul-size": "clamp(32px, 8vw, 46px)",
      "--card-hangul-color": "#3b2f20",
      "--card-english-size": "clamp(11px, 2.8vw, 14px)",
      "--card-english-color": "#675235",
      "--card-brand-left": "50%",
      "--card-brand-top": "8.5%",
      "--card-brand-transform": "translateX(-50%)",
      "--card-brand-color": "#6f5a41",
      "--card-tone": "linear-gradient(180deg, rgba(255,255,255,.03), rgba(0,0,0,.08))"
    }
  },
  frame: {
    id: "frame",
    label: "Frame",
    note: "Signature geometric frame inspired by Korean linework.",
    backgroundImage: "assets/cards/frame-template.jpg",
    vars: {
      "--card-max-width": "360px",
      "--card-aspect-ratio": "383 / 626",
      "--card-text-left": "17%",
      "--card-text-right": "17%",
      "--card-text-bottom": "auto",
      "--card-text-top": "50%",
      "--card-text-transform": "translateY(-50%)",
      "--card-text-align": "center",
      "--card-text-max-width": "70%",
      "--card-hangul-size": "clamp(30px, 7.8vw, 44px)",
      "--card-hangul-color": "#3d3428",
      "--card-english-size": "clamp(11px, 2.6vw, 14px)",
      "--card-english-color": "#5c5141",
      "--card-brand-left": "50%",
      "--card-brand-top": "9%",
      "--card-brand-transform": "translateX(-50%)",
      "--card-brand-color": "#6d6252",
      "--card-tone": "linear-gradient(180deg, rgba(255,255,255,.03), rgba(0,0,0,.08))"
    }
  },
  dark: {
    id: "dark",
    label: "Dark",
    note: "Premium dark style designed for dramatic sharing.",
    backgroundImage: "assets/cards/dark-template.jpg",
    vars: {
      "--card-max-width": "360px",
      "--card-aspect-ratio": "383 / 626",
      "--card-text-left": "14%",
      "--card-text-right": "14%",
      "--card-text-bottom": "auto",
      "--card-text-top": "50%",
      "--card-text-transform": "translateY(-50%)",
      "--card-text-align": "center",
      "--card-text-max-width": "72%",
      "--card-hangul-size": "clamp(31px, 8vw, 45px)",
      "--card-hangul-color": "#f5efe4",
      "--card-english-size": "clamp(11px, 2.6vw, 14px)",
      "--card-english-color": "#e5d7c3",
      "--card-brand-left": "50%",
      "--card-brand-top": "9%",
      "--card-brand-transform": "translateX(-50%)",
      "--card-brand-color": "#f0e3d0",
      "--card-tone": "linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.3))"
    }
  }
};

export const CARD_STYLE_ORDER = ["classic", "frame", "dark", "honorary"];

export function getCardStyle(styleId) {
  if (styleId === "legacy") return CARD_STYLES.honorary;
  return CARD_STYLES[styleId] || CARD_STYLES.classic;
}
