import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { removeUser } from "../utils/userSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data?.data));
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

  useEffect(() => {
    fetchConnections();
  }, []);

  if (connections.length === 0)
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-base-content/10 bg-base-100 p-8 text-center shadow-xl shadow-base-content/5">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
            &lt;/&gt;
          </div>
          <h1 className="text-xl font-bold tracking-tight text-base-content">
            No connections yet
          </h1>
          <p className="mt-2 text-sm leading-6 text-base-content/60">
            Start connecting with developers to build your network.
          </p>
        </div>
      </div>
    );
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-base-content/10 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Your network
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Connections
          </h1>
        </div>
        <span className="badge badge-primary badge-outline px-3 py-3 text-xs font-semibold">
          {connections.length}{" "}
          {connections.length === 1 ? "connection" : "connections"}
        </span>
      </div>
      <ul className="space-y-4">
        {connections.map((connection) => {
          const { _id, firstName, lastName, about, photoUrl, skills } =
            connection;
          return (
            <li
              className="group grid gap-0 overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-lg shadow-base-content/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl sm:grid-cols-[8rem_1fr]"
              key={_id}
            >
              <figure className="relative h-52 overflow-hidden bg-base-300 sm:h-full sm:min-h-40">
                <img
                  src={photoUrl}
                  alt={`${firstName} ${lastName}`}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </figure>
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
                          className="badge badge-outline border-primary/30 bg-primary/5 px-3 py-3 text-xs font-semibold text-primary"
                          key={skill}
                        >
                          {skill}
                        </span>
                      ),
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
};
export default Connections;
