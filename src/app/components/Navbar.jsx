import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { getProfileCompleteness } from "../utils/profileCompleteness";
import Loader from "./Loader";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("devtinder-theme") === "dark" ? "dark" : "light",
  );
  const [pendingRequests, setPendingRequests] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profile = getProfileCompleteness(user);

  useEffect(() => {
    if (!user) return;

    const fetchNotificationCounts = async () => {
      try {
        const [requestsResponse, unreadResponse] = await Promise.all([
          axios.get(BASE_URL + "/user/request/received", {
            withCredentials: true,
          }),
          axios.get(BASE_URL + "/chat/unread-count", {
            withCredentials: true,
          }),
        ]);
        setPendingRequests(requestsResponse.data?.data?.length ?? 0);
        setUnreadMessages(unreadResponse.data?.unreadCount ?? 0);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Error fetching notification counts:", error);
        }
      }
    };

    fetchNotificationCounts();
    const interval = setInterval(fetchNotificationCounts, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("devtinder-theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    dispatch(removeUser());
    navigate("/login");

    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeDropdown = (event) => {
    event.currentTarget.blur();
  };

  const handleLandingSection = (event, sectionId) => {
    event.preventDefault();
    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", `/#${sectionId}`);
      return;
    }
    navigate(`/#${sectionId}`);
  };

  return (
    <div className="navbar min-h-16 border-b border-white/10 bg-neutral px-3 text-neutral-content shadow-lg sm:px-6">
      <div className="min-w-0 flex-1">
        <Link
          to={user ? "/feed" : "/"}
          className="flex w-fit items-center gap-2 text-lg font-bold tracking-tight transition-opacity hover:opacity-80 sm:text-xl"
        >
          <img
            src="/logo.png"
            alt="DevTinder Logo"
            className="h-10 w-10 rounded-full object-contain ring-2 ring-white/15 sm:h-11 sm:w-11"
          />
          <span className="truncate">DevTinder</span>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <label className="swap swap-rotate rounded-full p-2 text-neutral-content transition-colors hover:bg-white/10">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={(event) =>
              setTheme(event.target.checked ? "dark" : "light")
            }
            aria-label="Toggle dark mode"
          />
          <svg
            className="swap-off h-5 w-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64 17.657 4.22 19.07l1.414 1.415 1.415-1.414-1.415-1.414ZM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-15h2V0h-2v3Zm0 21h2v-3h-2v3ZM24 11h-3v2h3v-2ZM3 11H0v2h3v-2Zm15.364-5.778 1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414ZM5.636 5.636 7.05 4.222 5.636 2.808 4.222 4.222l1.414 1.414Zm12.728 12.021-1.414 1.414 1.414 1.414 1.414-1.414-1.414-1.414Z" />
          </svg>
          <svg
            className="swap-on h-5 w-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.36.73A8.15 8.15 0 0 1 9.08 5.9a8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.75 10.14 10.14 0 1 0 21.64 13Z" />
          </svg>
        </label>
        {user && (
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-neutral-content/55">
                Welcome back
              </p>
              <p className="max-w-32 truncate text-sm font-semibold">
                {user.firstName}
              </p>
            </div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                aria-label="Open account menu"
                className="btn btn-ghost btn-circle avatar h-12 w-12 transition-colors hover:bg-white/10"
              >
                <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-neutral">
                  <img
                    alt={`${user.firstName}'s profile`}
                    src={user.photoUrl}
                    className="object-cover"
                  />
                </div>
              </div>

              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content z-10 mt-3 w-64 rounded-2xl border border-base-content/10 bg-base-100 p-2 text-base-content shadow-2xl shadow-black/20"
              >
                <li className="pointer-events-none mb-1 border-b border-base-content/10 px-3 pb-3 pt-2">
                  <div className="flex items-center gap-3 px-0 py-1">
                    <div className="w-10 shrink-0 rounded-full ring-1 ring-base-content/10">
                      <img
                        alt=""
                        src={user.photoUrl}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-base-content/55">
                        Developer profile
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-base-content/60">
                      <span>Profile completeness</span>
                      <span>{profile.percentage}%</span>
                    </div>
                    <progress
                      className="progress progress-primary w-full"
                      value={profile.percentage}
                      max="100"
                    />
                  </div>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="rounded-xl text-base-content transition-colors hover:bg-base-200"
                    onClick={closeDropdown}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/connections"
                    className="rounded-xl text-base-content transition-colors hover:bg-base-200"
                    onClick={closeDropdown}
                  >
                    Connections
                  </Link>
                </li>
                <li>
                  <Link
                    to="/requests"
                    className="rounded-xl text-base-content transition-colors hover:bg-base-200"
                    onClick={closeDropdown}
                  >
                    <span className="flex items-center justify-between gap-3">
                      Requests
                      {pendingRequests > 0 && (
                        <span className="badge badge-secondary badge-sm">
                          {pendingRequests}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/connections"
                    className="rounded-xl text-base-content transition-colors hover:bg-base-200"
                    onClick={closeDropdown}
                  >
                    <span className="flex items-center justify-between gap-3">
                      Messages
                      {unreadMessages > 0 && (
                        <span className="badge badge-primary badge-sm">
                          {unreadMessages}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/feed"
                    className="rounded-xl text-base-content transition-colors hover:bg-base-200"
                    onClick={closeDropdown}
                  >
                    Feed
                  </Link>
                </li>
                <li>
                  <a
                    className="rounded-xl text-error transition-colors hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-70"
                    onClick={handleLogout}
                    aria-disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <Loader size="sm" text="Logging out..." />
                    ) : (
                      "Logout"
                    )}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
        {!user && (
          <>
            <nav
              className="hidden items-center gap-5 text-sm font-semibold md:flex"
              aria-label="Primary navigation"
            >
              <a
                href="#how-it-works"
                onClick={(event) => handleLandingSection(event, "how-it-works")}
                className="transition-colors hover:text-primary"
              >
                How it works
              </a>
              <a
                href="#features"
                onClick={(event) => handleLandingSection(event, "features")}
                className="transition-colors hover:text-primary"
              >
                Features
              </a>
              <a
                href="#about"
                onClick={(event) => handleLandingSection(event, "about")}
                className="transition-colors hover:text-primary"
              >
                About
              </a>
            </nav>
            <div className="dropdown dropdown-end md:hidden">
              <div
                tabIndex={0}
                role="button"
                aria-label="Open landing page menu"
                className="btn btn-ghost btn-circle"
              >
                <span className="text-xl" aria-hidden="true">
                  &#9776;
                </span>
              </div>
              <ul
                tabIndex={-1}
                className="menu dropdown-content z-10 mt-3 w-52 rounded-2xl border border-base-content/10 bg-base-100 p-2 text-base-content shadow-2xl"
              >
                <li>
                  <a
                    href="#how-it-works"
                    onClick={(event) =>
                      handleLandingSection(event, "how-it-works")
                    }
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    onClick={(event) => handleLandingSection(event, "features")}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(event) => handleLandingSection(event, "about")}
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm rounded-xl">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm rounded-xl">
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
