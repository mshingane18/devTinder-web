import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ fromFeed, user }) => {
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
      <div className="card bg-base-300 w-96 shadow-lg p-1">
        <figure className="h-96 overflow-hidden">
          <img
            src={photoUrl}
            alt={firstName}
            className="w-full h-full object-cover object-center"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          <p>
            {age && <span>{age}</span>}
            {gender && <span>, {gender}</span>}
          </p>
          <p>{about}</p>
          <p>{skills}</p>
          <div className="card-actions justify-center mt-2">
            <button
              disabled={fromFeed}
              className="btn btn-primary"
              onClick={() => handleFeed("ignored", _id)}
            >
              Ingored
            </button>
            <button
              disabled={fromFeed}
              className="btn btn-secondary"
              onClick={() => handleFeed("interested", _id)}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserCard;
