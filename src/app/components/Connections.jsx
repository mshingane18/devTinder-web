import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

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
      <div className="flex justify-center pt-20">
        <h1>No connections found</h1>
      </div>
    );
  return (
    <div className="mt-5">
      <ul className="list bg-base-300 rounded-box shadow-md w-1/2 m-auto">
        <li className="p-4 pb-2 text-black font-extrabold opacity-60 tracking-wide text-center">
          Connections
        </li>
        {connections.map((connection) => {
          const { _id, firstName, lastName, about, photoUrl, skills } =
            connection;
          return (
            <li className="list-row bg-amber-50 m-1" key={_id}>
              <div className="flex items-center">
                <img
                  className="size-20 rounded-full"
                  alt="Tailwind CSS list item"
                  src={photoUrl}
                />
              </div>
              <div>
                <div>{firstName + " " + lastName}</div>
                <div className="text-xs uppercase font-semibold opacity-60 mb-1">
                  {skills}
                </div>
                <p className="list-col-wrap text-xs">{about}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Connections;
