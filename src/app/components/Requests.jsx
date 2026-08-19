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
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-base-content/10 bg-base-100 p-8 text-center shadow-xl shadow-base-content/5">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-2xl text-secondary">
            +
          </div>
          <h1 className="text-xl font-bold tracking-tight text-base-content">
            No pending requests
          </h1>
          <p className="mt-2 text-sm leading-6 text-base-content/60">
            New connection requests will appear here.
          </p>
        </div>
      </div>
    );
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-base-content/10 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
            Incoming invites
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Connection requests
          </h1>
        </div>
        <span className="badge badge-secondary badge-outline px-3 py-3 text-xs font-semibold">
          {requests.length} {requests.length === 1 ? "request" : "requests"}
        </span>
      </div>
      <ul className="space-y-4">
        {requests.map((req) => {
          const { _id, firstName, lastName, about, photoUrl, skills } =
            req.fromUserId;
          return (
            <li
              className="group grid overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-lg shadow-base-content/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/30 hover:shadow-xl sm:grid-cols-[9rem_1fr_auto]"
              key={_id}
            >
              <div className="relative h-52 overflow-hidden bg-base-300 sm:h-full sm:min-h-44">
                <img
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  src={photoUrl}
                  alt={`${firstName} ${lastName}`}
                />
              </div>

              <div className="flex min-w-0 flex-col justify-center gap-3 p-5 sm:p-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-base-content sm:text-2xl">
                    {firstName} {lastName}
                  </h2>
                  <p className="mt-1 line-clamp-3 text-sm leading-6 text-base-content/65">
                    {about}
                  </p>
                </div>
                {skills && (
                  <div className="flex flex-wrap gap-2" aria-label="Skills">
                    {(Array.isArray(skills) ? skills : [skills]).map(
                      (skill) => (
                        <span
                          className="badge badge-outline border-secondary/30 bg-secondary/5 px-3 py-3 text-xs font-semibold text-secondary"
                          key={`${_id}-${skill}`}
                        >
                          {skill}
                        </span>
                      ),
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-base-content/10 p-4 sm:flex sm:flex-col sm:items-stretch sm:justify-center sm:border-l sm:border-t-0 sm:p-5">
                <button
                  type="button"
                  className="btn btn-outline btn-error h-11 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  onClick={() => handleRequest("rejected", req._id)}
                  aria-label={`Reject request from ${firstName} ${lastName}`}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="btn btn-secondary h-11 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  onClick={() => handleRequest("accepted", req._id)}
                  aria-label={`Accept request from ${firstName} ${lastName}`}
                >
                  Accept
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
};
export default Requests;
