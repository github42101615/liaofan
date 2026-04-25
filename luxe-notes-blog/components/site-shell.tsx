import Link from "next/link";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark" />
          Luxe Notes
        </Link>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/#journal">Journal</Link>
          <Link href="/admin">Studio</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
