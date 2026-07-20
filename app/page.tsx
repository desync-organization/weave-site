import type { Metadata } from "next";
import Image from "next/image";
import {
  OrbitCTA,
  SignalIcon,
  type SignalVariant,
} from "./components/WeaveIllustrations";
import { SiteShell } from "./components/SiteShell";

export const metadata: Metadata = {
  title: "Weave",
};

const features: Array<{
  title: string;
  body: string;
  variant: SignalVariant;
  code: string;
}> = [
  {
    title: "Live repository stories",
    body: "Releases, commits, demos, and milestones become a feed worth opening every day.",
    variant: "conversation",
    code: "LIVE / 01",
  },
  {
    title: "Follow the signal",
    body: "Keep up with maintainers, friends, teams, and the projects moving your stack forward.",
    variant: "audience",
    code: "FEED / 02",
  },
  {
    title: "Catch projects early",
    body: "Find rising repositories through real people — before a star count tells everyone else.",
    variant: "momentum",
    code: "RISE / 03",
  },
  {
    title: "Save what matters",
    body: "Build a visual shelf of tools, libraries, and ideas you actually want to return to.",
    variant: "attention",
    code: "SAVE / 04",
  },
  {
    title: "Find your stack",
    body: "Tune discovery by language, topic, framework, and the builders whose taste you trust.",
    variant: "targeting",
    code: "STACK / 05",
  },
  {
    title: "Built for every builder",
    body: "From first commit to breakout project, Weave gives shipping a place to be seen.",
    variant: "growth",
    code: "SHIP / 06",
  },
];

export default function Home() {
  return (
    <SiteShell>
      <div className="one-page">
        <section className="scroll-section intro-section" id="intro">
          <p className="section-index">
            <span>01</span> Introduction
          </p>

          <div className="intro-grid">
            <div className="intro-copy">
              <p className="intro-kicker">The social layer for GitHub repositories</p>
              <h1>
                Instagram but,
                <span>GitHub Repos.</span>
              </h1>
              <p className="intro-lede">
                Follow repositories like people. Share releases like stories.
                Discover useful code through the builders already moving it forward.
              </p>
            </div>

            <aside className="hero-download-card" aria-labelledby="download-title">
              <div className="download-card__topline">
                <span>WEAVE / ANDROID</span>
                <span>EARLY ACCESS</span>
              </div>
              <Image
                className="download-card__mark"
                src="/weave-logo-mark.svg"
                alt=""
                width={88}
                height={76}
              />
              <p className="download-card__eyebrow">Install the preview</p>
              <h2 id="download-title">Your next favorite repo is already shipping.</h2>
              <a className="main-download-button" href="/weave.apk" download>
                <span>
                  <strong>Download now</strong>
                  <small>Android APK · direct install</small>
                </span>
                <b aria-hidden="true">↓</b>
              </a>
              <p className="download-card__note">Free for builders and open-source teams.</p>
            </aside>
          </div>

          <div className="hero-ribbon" aria-label="Weave product highlights">
            <span>Follow what ships</span>
            <span>See projects early</span>
            <span>Connect through code</span>
          </div>
        </section>

        <section className="scroll-section discover-section" id="discover">
          <header className="section-heading">
            <div>
              <p className="section-index">
                <span>02</span> Discover
              </p>
              <h2>
                GitHub records the work.
                <span>Weave makes it feel alive.</span>
              </h2>
            </div>
            <p>
              A visual feed for releases, experiments, and repositories worth
              knowing before everyone else does.
            </p>
          </header>

          <div className="feature-grid" aria-label="What Weave does">
            {features.map((feature, index) => (
              <article className={`feature-card feature-card--${index + 1}`} key={feature.title}>
                <div className="feature-card__copy">
                  <p className="feature-card__code">{feature.code}</p>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
                <SignalIcon
                  variant={feature.variant}
                  ariaLabel={`${feature.title} geometric network illustration`}
                />
              </article>
            ))}
          </div>

          <div className="section-tail">
            <span>06 signals</span>
            <p>Built to browse. Made to ship.</p>
            <a href="#community">Keep scrolling <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section className="scroll-section community-section" id="community">
          <header className="section-heading section-heading--community">
            <div>
              <p className="section-index">
                <span>03</span> Community
              </p>
              <h2>
                Built around what you ship.
                <span>Backed by the people who build it.</span>
              </h2>
            </div>
            <p>
              Projects become conversations. Maintainers become people you know.
              Open source becomes a place you can belong.
            </p>
          </header>

          <div className="community-orbit">
            <OrbitCTA ariaLabel="Repositories orbiting the Weave community" />
            <div className="community-orbit__mark" aria-hidden="true">
              <Image src="/weave-logo-mark.svg" alt="" width={48} height={42} />
            </div>
          </div>

          <div className="community-footer">
            <p><span>FOLLOW</span> the repositories shaping your stack.</p>
            <p><span>SEE</span> the people and thinking behind every release.</p>
            <p><span>CONNECT</span> through the work you already care about.</p>
          </div>
        </section>

        <footer className="site-footer">
          <span>WEAVE © 2026</span>
          <span>OPEN SOURCE / OPEN CONNECTIONS</span>
        </footer>
      </div>
    </SiteShell>
  );
}
