import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useSelector } from "react-redux";

const steps = [
  [
    "01",
    "Create your profile",
    "Add your skills, experience, about information, and a profile photo.",
  ],
  [
    "02",
    "Discover developers",
    "Browse developer profiles and discover people with complementary skills.",
  ],
  [
    "03",
    "Connect",
    "Send connection requests and accept the ones that feel right.",
  ],
  [
    "04",
    "Start a conversation",
    "Chat in real time and turn a connection into a conversation about ideas, projects, or collaboration.",
  ],
];

const features = [
  [
    "Developer profiles",
    "Show the skills, experience, and work style that make you you.",
  ],
  ["Discovery feed", "Discover developers based on their profiles and skills."],
  ["Connection requests", "Choose who enters your professional network."],
  ["Real-time chat", "Move from a profile glance to an actual conversation."],
  [
    "Authentication & password recovery",
    "Sign in securely, protect private routes, and recover your account when needed.",
  ],
  ["Profile photos", "Put a human face to the next person you build with."],
];

const Landing = () => {
  const location = useLocation();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    document.title = "DevTinder - Connect. Collaborate. Build together.";
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      "content",
      "DevTinder helps developers discover, connect, and collaborate with other developers.",
    );
  }, []);

  useEffect(() => {
    const sectionId = location.hash.slice(1);
    if (!sectionId) return;

    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [location.hash]);

  return (
    <div className="bg-base-200 text-base-content">
      <section className="relative overflow-hidden border-b border-base-content/10 bg-neutral text-neutral-content">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0_45%,rgba(255,255,255,.08)_45%_46%,transparent_46%_100%)] bg-size-[22rem_22rem] opacity-20" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:py-20">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Developer networking, with intent
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight sm:text-7xl">
              Connect. Collaborate.{" "}
              <span className="text-primary">Build together.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-neutral-content/70 sm:text-lg">
              DevTinder helps developers discover people who share their
              curiosity, complement their skills, and want to make something
              useful.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={user ? "/feed" : "/signup"}
                className="btn btn-primary rounded-xl px-6"
              >
                {user ? "Go to Feed" : "Get Started"}
              </Link>
              <Link
                to="/login"
                className="btn btn-outline rounded-xl border-neutral-content/30 px-6 text-neutral-content hover:border-neutral-content hover:bg-neutral-content hover:text-neutral"
              >
                Log in
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-content/50">
              <span>Discover talent</span>
              <span>Build trust</span>
              <span>Ship together</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md py-4 lg:justify-self-end">
            <div
              className="absolute left-1/2 top-4 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-2 gap-3 sm:gap-5">
              <article className="connection-story-card animate-[connection-float_7s_ease-in-out_infinite] rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-black text-primary-content ring-4 ring-primary/20"
                    aria-hidden="true"
                  >
                    A
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-white">Alex</h2>
                    <p className="truncate text-xs text-white/60">
                      Frontend Developer
                    </p>
                  </div>
                </div>
                <div
                  className="mt-4 flex flex-wrap gap-1.5"
                  aria-label="Alex's skills"
                >
                  <span className="badge badge-sm border-white/15 bg-white/10 text-white">
                    React
                  </span>
                  <span className="badge badge-sm border-white/15 bg-white/10 text-white">
                    TypeScript
                  </span>
                  <span className="badge badge-sm border-white/15 bg-white/10 text-white">
                    JavaScript
                  </span>
                </div>
              </article>
              <article className="connection-story-card animate-[connection-float_7s_ease-in-out_1.2s_infinite] rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-lg font-black text-secondary-content ring-4 ring-secondary/20"
                    aria-hidden="true"
                  >
                    P
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-white">Priya</h2>
                    <p className="truncate text-xs text-white/60">
                      Backend Developer
                    </p>
                  </div>
                </div>
                <div
                  className="mt-4 flex flex-wrap gap-1.5"
                  aria-label="Priya's skills"
                >
                  <span className="badge badge-sm border-white/15 bg-white/10 text-white">
                    Node.js
                  </span>
                  <span className="badge badge-sm border-white/15 bg-white/10 text-white">
                    MongoDB
                  </span>
                  <span className="badge badge-sm border-white/15 bg-white/10 text-white">
                    Express
                  </span>
                </div>
              </article>
            </div>
            <div
              className="relative mx-auto flex w-[78%] items-center justify-center py-6"
              aria-label="Alex and Priya connected"
            >
              <div
                className="absolute left-0 right-0 h-px bg-linear-to-r from-primary/20 via-primary to-secondary/20"
                aria-hidden="true"
              />
              <div
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 bg-neutral text-lg text-primary shadow-lg shadow-primary/30 animate-[connection-pulse_3s_ease-in-out_infinite]"
                aria-hidden="true"
              >
                ✦
              </div>
              <span className="absolute top-14 text-[0.65rem] font-black tracking-[0.24em] text-primary">
                CONNECTED
              </span>
            </div>
            <article className="relative mx-auto mt-5 w-[88%] rounded-2xl border border-white/15 bg-base-100/95 p-4 text-base-content shadow-2xl shadow-black/30 backdrop-blur-xl animate-[chat-rise_6s_ease-in-out_infinite]">
              <div className="flex items-center justify-between border-b border-base-content/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-black text-primary">
                    ↗
                  </span>
                  <div>
                    <p className="text-sm font-bold">Real-time conversation</p>
                    <p className="text-[0.65rem] text-success">● Connected</p>
                  </div>
                </div>
                <span className="text-xs text-base-content/45">now</span>
              </div>
              <div className="mt-4 space-y-2 text-xs leading-5">
                <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-base-200 px-3 py-2">
                  Interested in building something together?
                </p>
                <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-content">
                  Sure! Let&apos;s discuss the idea.
                </p>
              </div>
              <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-base-content/45">
                Developer collaboration, in motion
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:py-28"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            The idea
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            What is DevTinder?
          </h2>
        </div>
        <div className="max-w-2xl text-lg leading-8 text-base-content/70">
          <p>
            DevTinder is a focused place for developers to find each other,
            showcase their skills, and start conversations that can lead to
            better products.
          </p>
          <p className="mt-5">
            Create a profile, discover people in the feed, make intentional
            connections, and chat once the connection is mutual.
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-base-content/10 bg-base-100"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">
            A clear path forward
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight sm:text-5xl">
            From profile to project in four moves.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-base-content/10 bg-base-content/10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([number, title, text]) => (
              <article key={number} className="bg-base-100 p-6">
                <span className="text-sm font-black text-secondary">
                  {number}
                </span>
                <h3 className="mt-10 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-base-content/60">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-28"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Inside the product
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              Tools for meaningful developer connections.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-base-content/60">
            Real tools for developer discovery, connection, and conversation.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, text], index) => (
            <article
              key={title}
              className="group rounded-2xl border border-base-content/10 bg-base-100 p-6 transition-colors hover:border-primary/40"
            >
              <span className="text-xs font-black text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-8 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-base-content/60">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-neutral text-neutral-content">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Make the next connection count
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
              Your network can help you build better products.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-neutral-content/65">
              Find complementary skills, exchange ideas, and connect directly
              with developers who are open to collaboration.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link to="/signup" className="btn btn-primary rounded-xl px-6">
              Create your profile
            </Link>
            <Link
              to="/login"
              className="btn btn-outline rounded-xl border-neutral-content/30 text-neutral-content"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
