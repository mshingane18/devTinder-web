import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-neutral px-2 py-4 text-neutral-content sm:px-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <aside className="flex items-center gap-3 text-center sm:text-left">
          <img
            src="/logo.png"
            alt="DevTinder Logo"
            className="h-11 w-11 rounded-full object-contain ring-2 ring-white/15"
          />
          <div>
            <p className="font-bold tracking-tight">DevTinder</p>
            <p className="mt-1 text-xs text-neutral-content/65">
              Connect. Collaborate. Build Together.
            </p>
            <p className="mt-1 text-xs text-neutral-content/55">
              Copyright © {new Date().getFullYear()} · All rights reserved
            </p>
          </div>
        </aside>
        <nav
          aria-label="Footer navigation"
          className="flex items-center gap-4 text-sm font-semibold"
        >
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <Link to="/login" className="hover:text-primary">
            Login
          </Link>
          <Link to="/signup" className="hover:text-primary">
            Sign up
          </Link>
        </nav>
      </div>
    </footer>
  );
};
export default Footer;
