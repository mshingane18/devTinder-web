import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar bg-neutral text-neutral-content shadow-sm">
      <div className="flex-1">
        <Link
          to="/feed"
          className="flex items-center gap-2 text-xl font-bold cursor-pointer w-fit"
        >
          <img
            src="/logo.png"
            alt="DevTinder Logo"
            className="w-16 h-auto rounded-full object-contain"
          />
          <span>DevTinder</span>
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-2">
          <div className="justify-center">Welcome, {user.firstName}</div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar mx-5"
            >
              <div className="w-10 rounded-full">
                <img alt="User" src={user.photoUrl} />
              </div>
            </div>

            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between text-black">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections" className="text-black">
                  Connections
                </Link>
              </li>
              <li>
                <Link to="/requests" className="text-black">
                  Requests
                </Link>
              </li>
              <li>
                <a className="text-black" onClick={handleLogout}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
