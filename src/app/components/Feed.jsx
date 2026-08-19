import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useLocation, useNavigate } from "react-router";
import Notification from "./Notification";

const Feed = () => {
  const dispatch = useDispatch();
  const feedData = useSelector((store) => store.feed);
  const navigate = useNavigate();
  const location = useLocation();

  const [success, setSuccess] = useState("");

  const fetchFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      dispatch(addFeed(res.data?.userFeed));
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
    fetchFeed();
  }, []);

  useEffect(() => {
    const message = location.state?.success;

    if (message) {
      setSuccess(message);

      // Remove success from router state
      navigate(location.pathname, {
        replace: true,
        state: {},
      });

      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!feedData) return;
  if (feedData.length <= 0)
    return (
      <main className="flex min-h-[65vh] items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-2xl border border-base-content/10 bg-base-100 p-8 text-center shadow-xl shadow-base-content/5">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
            &lt;/&gt;
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Discovery complete
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-base-content">
            No more developers to show
          </h1>
          <p className="mt-3 text-sm leading-6 text-base-content/60">
            Check back soon for more people to connect with.
          </p>
        </div>
      </main>
    );
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-2 w-full max-w-md text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Discover developers
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
          Find your next connection
        </h1>
        <p className="mt-2 text-sm leading-6 text-base-content/60">
          Explore profiles and connect with people who build like you do.
        </p>
      </div>
      <div className="relative w-full max-w-md">
        {success && <Notification type="success" message={success} />}
        <UserCard formFeed={true} user={feedData[0]} />
      </div>
    </main>
  );
};
export default Feed;
