import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestsSlice";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const requests = useSelector((store) => store.requests);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data?.data));
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

  const handleRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + `/request/review/${status}/${userId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(userId));
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
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return (
      <div className="flex justify-center mt-20">
        <h1>No requests found.</h1>
      </div>
    );
  return (
    <div className="mt-5">
      <ul className="list bg-base-300 rounded-box shadow-md w-3xl m-auto">
        <li className="p-4 pb-2 text-black font-extrabold opacity-60 tracking-wide text-center">
          Requests
        </li>
        {requests.map((req) => {
          const { _id, firstName, lastName, about, photoUrl, skills } =
            req.fromUserId;
          return (
            <li className=" list-row bg-amber-50 m-1" key={_id}>
              <div className="flex items-center">
                <img
                  className="size-20 rounded-full"
                  alt="Tailwind CSS list item"
                  src={photoUrl}
                />
              </div>
              <div className="justify-center">
                <div>{firstName + " " + lastName}</div>
                <div className="text-xs uppercase font-semibold opacity-60 mb-1">
                  {skills}
                </div>
                <p className="list-col-wrap text-xs">{about}</p>
              </div>
              <div className="flex items-center">
                <button
                  className="btn btn-active btn-primary"
                  onClick={() => handleRequest("rejected", req._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-active btn-secondary mx-2"
                  onClick={() => handleRequest("accepted", req._id)}
                >
                  Accept
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Requests;
