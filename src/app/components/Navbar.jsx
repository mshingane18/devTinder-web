import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("devtinder-theme") === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("devtinder-theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const closeDropdown = (event) => {
    event.currentTarget.blur();
  };

  return (
    <div className="navbar min-h-16 border-b border-white/10 bg-neutral px-3 text-neutral-content shadow-lg sm:px-6">
      <div className="min-w-0 flex-1">
        <Link
          to="/feed"
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
                    Requests
                  </Link>
                </li>
                <li>
                  <a
                    className="rounded-xl text-error transition-colors hover:bg-error/10"
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
