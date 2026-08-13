import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ formFeed, user }) => {
  const dispatch = useDispatch();

  const { _id, firstName, lastName, age, gender, about, photoUrl, skills } =
    user;

  const handleFeed = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + `/request/send/${status}/${userId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(userId));
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

  return (
    <div className="flex justify-center mt-5">
      <div className="card bg-gray-600 w-80 shadow-lg p-1">
        <figure className="h-96 p-5 overflow-hidden">
          <img
            src={photoUrl}
            alt={firstName}
            className="w-full h-full rounded-xl object-cover object-top"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-center text-2xl/9 font-bold tracking-tight text-white">
            {firstName + " " + lastName}
          </h2>
          <p className="text-sm/6 text-gray-200">
            {age && <span>{age}</span>}
            {gender && <span>, {gender}</span>}
          </p>
          <p className="text-sm/6 text-gray-200">{about}</p>
          <p className="text-sm/6 text-gray-200">{skills}</p>
          {formFeed && (
            <div className="card-actions justify-center mt-2">
              <button
                className="btn btn-dash btn-error"
                onClick={() => handleFeed("ignored", _id)}
              >
                Ignored
              </button>
              <button
                className="btn btn-dash btn-success"
                onClick={() => handleFeed("interested", _id)}
              >
                Interested
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserCard;
