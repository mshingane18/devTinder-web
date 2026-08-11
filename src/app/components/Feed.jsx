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
      <div className="flex justify-center p-5 bg-base-300 mt-10">
        <h1>No more user's found</h1>
      </div>
    );
  return (
    <>
      {success && <Notification type="success" message={success} />}
      <UserCard fromFeed={false} user={feedData[0]} />;
    </>
  );
};
export default Feed;
