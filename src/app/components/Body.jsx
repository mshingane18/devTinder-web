import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import Loader from "./Loader";

const Body = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const isPublicRoute =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password/");

  const fetchUser = async () => {
    setIsUserLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      console.error("Status:", status);
      console.error("Message:", message);
      if (status === 401) {
        navigate("/login");
        return;
      }
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    if (isPublicRoute) {
      setIsUserLoading(false);
      return;
    }
    setIsUserLoading(true);
    fetchUser();
  }, [isPublicRoute, location.pathname]);

  if (!isPublicRoute && isUserLoading && !userData) {
    return (
      <div className="flex min-h-screen flex-col overflow-x-hidden bg-base-200 text-base-content">
        <div className="shrink-0">
          <Navbar />
        </div>
        <main className="flex flex-1 items-center justify-center pb-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader size="lg" ariaLabel="Loading profile" />
            <p className="text-sm font-medium text-base-content/60">
              Loading your profile...
            </p>
          </div>
        </main>
        <div className="shrink-0">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-base-200 text-base-content">
      <div className="shrink-0">
        <Navbar />
      </div>

      <main className="flex-1 pb-6">
        <Outlet />
      </main>

      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
};
export default Body;
