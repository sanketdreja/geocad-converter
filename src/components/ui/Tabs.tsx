import type { ReactNode } from "react";

export function Tabs({ children }: { children: ReactNode }) {
  return <div className="tabs">{children}</div>;
}

export function TabButton({ children, active }: { children: ReactNode; active?: boolean }) {
  return <button className={active ? "tab-button tab-button-active" : "tab-button"}>{children}</button>;
}
