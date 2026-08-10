import { MobileIcon } from "./mobile-icons";

const items = [
  { label: "Home", href: "/", icon: "home" as const },
  { label: "Papers", href: "/explore", icon: "paper" as const },
  { label: "Saved", href: "/dashboard", icon: "saved" as const },
  { label: "Profile", href: "/dashboard", icon: "profile" as const },
];

export function MobileBottomNav() {
  return <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{items.map((item, index) =>
    <a className={index === 0 ? "active" : ""} href={item.href} key={item.label}><MobileIcon name={item.icon}/><span>{item.label}</span></a>
  )}</nav>;
}