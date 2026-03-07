export const CARD_STYLES = {
  classic: {
    id: "classic",
    label: "Classic",
    note: "Soft ivory style for timeless everyday use.",
    backgroundImage: "assets/cards/classic-template.jpg",
    vars: {
      "--card-text-left": "10%",
      "--card-text-right": "10%",
      "--card-text-bottom": "16%",
      "--card-text-align": "left",
      "--card-hangul-size": "clamp(26px, 4.6vw, 36px)",
      "--card-hangul-color": "#3b2f20",
      "--card-english-size": "clamp(11px, 1.7vw, 14px)",
      "--card-english-color": "#5f4c34",
      "--card-brand-left": "10%",
      "--card-brand-top": "10%",
      "--card-brand-color": "#6f5a41",
      "--card-tone": "linear-gradient(180deg, rgba(0,0,0,.01), rgba(0,0,0,.07))"
    }
  },
  frame: {
    id: "frame",
    label: "Frame",
    note: "Signature geometric frame inspired by Korean linework.",
    backgroundImage: "assets/cards/frame-template.jpg",
    vars: {
      "--card-text-left": "14%",
      "--card-text-right": "14%",
      "--card-text-bottom": "16%",
      "--card-text-align": "center",
      "--card-hangul-size": "clamp(26px, 4.8vw, 38px)",
      "--card-hangul-color": "#3d3428",
      "--card-english-size": "clamp(11px, 1.8vw, 14px)",
      "--card-english-color": "#5c5141",
      "--card-brand-left": "50%",
      "--card-brand-top": "8%",
      "--card-brand-color": "#6d6252",
      "--card-tone": "linear-gradient(180deg, rgba(255,255,255,.01), rgba(0,0,0,.06))"
    }
  },
  dark: {
    id: "dark",
    label: "Dark",
    note: "Premium dark style designed for dramatic sharing.",
    backgroundImage: "assets/cards/dark-template.jpg",
    vars: {
      "--card-text-left": "11%",
      "--card-text-right": "11%",
      "--card-text-bottom": "15%",
      "--card-text-align": "left",
      "--card-hangul-size": "clamp(26px, 4.7vw, 37px)",
      "--card-hangul-color": "#f5efe4",
      "--card-english-size": "clamp(11px, 1.7vw, 14px)",
      "--card-english-color": "#e5d7c3",
      "--card-brand-left": "11%",
      "--card-brand-top": "10%",
      "--card-brand-color": "#f0e3d0",
      "--card-tone": "linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.3))"
    }
  }
};

export const CARD_STYLE_ORDER = ["classic", "frame", "dark"];

export function getCardStyle(styleId) {
  return CARD_STYLES[styleId] || CARD_STYLES.classic;
}
