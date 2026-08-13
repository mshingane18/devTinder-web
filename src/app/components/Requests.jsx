import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestsSlice";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router";
import { removeUser } from "../utils/userSlice";

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
        dispatch(removeUser());
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
      <div className="flex justify-center text-sm/6 text-gray-200 mt-20">
        <h1>No requests found.</h1>
      </div>
    );
  return (
    <div className="mt-5">
      <ul className="list rounded-box shadow-md w-3xl m-auto">
        <li className="p-4 pb-2 text-white font-extrabold tracking-wide text-center">
          Requests
        </li>
        {requests.map((req) => {
          const { _id, firstName, lastName, about, photoUrl, skills } =
            req.fromUserId;
          return (
            <div
              className="grid grid-cols-12 gap-4 card bg-base-100 shadow-sm w-3xl m-auto mt-5"
              key={_id}
            >
              <div className="overflow-hidden rounded-l-2xl col-span-3">
                <img
                  className="w-full h-full object-cover"
                  src={photoUrl}
                  alt={`${firstName} ${lastName}`}
                />
              </div>

              <div className="p-4 col-span-6">
                <h2 className="card-title">
                  {firstName} {lastName}
                </h2>
                <h6 className="text-sm text-gray-500">{skills}</h6>
                <p className="text-gray-500">{about}</p>
              </div>

              <div className="flex items-center justify-end gap-2 p-4 col-span-3">
                <button
                  className="btn btn-primary"
                  onClick={() => handleRequest("rejected", req._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleRequest("accepted", req._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};
export default Requests;
