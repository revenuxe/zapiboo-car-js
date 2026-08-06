export const navLinks = [
  { to: "/", label: "Sell Laptop" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

// Trimmed set shown in the site header (the rest live only in the footer).
export const headerNavLinks = [
  { to: "/", label: "Sell Laptop" },
  { to: "/contact", label: "Contact" },
] as const;
