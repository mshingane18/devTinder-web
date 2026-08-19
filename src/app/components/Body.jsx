import { Outlet, useNavigate } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
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
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
