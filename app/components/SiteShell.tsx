"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

const sections = [
  { id: "intro", label: "Introduction", number: "01" },
  { id: "discover", label: "Discover", number: "02" },
  { id: "community", label: "Community", number: "03" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-28% 0px -58%", threshold: [0, 0.2, 0.5] },
    );

    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="ribbon-shell">
      <a className="skip-link" href="#intro">
        Skip to content
      </a>

      <header className="ribbon-bar">
        <Link className="ribbon-brand" href="#intro" aria-label="Weave home">
          <Image src="/weave-logo-mark.svg" alt="" width={34} height={30} />
          <span>WEAVE</span>
        </Link>

        <nav className="ribbon-nav" aria-label="Page sections">
          {sections.map((section) => (
            <a
              key={section.id}
              className={activeSection === section.id ? "is-active" : undefined}
              href={`#${section.id}`}
              aria-current={activeSection === section.id ? "location" : undefined}
            >
              <small>{section.number}</small>
              <span>{section.label}</span>
            </a>
          ))}
        </nav>

        <div className="ribbon-status" aria-label="Android early access">
          <span aria-hidden="true" />
          Android / Early access
        </div>
      </header>

      <main id="main-content">{children}</main>
    </div>
  );
}

export default SiteShell;
