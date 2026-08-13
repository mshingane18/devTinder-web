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
      <div className="flex justify-center text-sm/6 text-gray-200 pt-20">
        <h1>No connections found</h1>
      </div>
    );
  return (
    <div className="mt-5">
      <ul className="list rounded-box shadow-md m-auto">
        <li className="p-4 pb-2 text-white font-extrabold tracking-wide text-center">
          Connections
        </li>
        {connections.map((connection) => {
          const { _id, firstName, lastName, about, photoUrl, skills } =
            connection;
          return (
            <div
              className=" card card-side bg-base-100 shadow-sm h-40 w-3xl m-auto mt-5 grid grid-cols-12"
              key={_id}
            >
              <figure className="overflow-hidden rounded-l-2xl col-span-2">
                <img src={photoUrl} alt="profile" />
              </figure>
              <div className="flex flex-row card-body col-span-9">
                <div>
                  <h2 className="card-title">
                    {firstName} {lastName}
                  </h2>
                  <h6 className="text-sm text-gray-900">{skills}</h6>
                  <p className="text-gray-500">{about}</p>
                </div>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};
export default Connections;
