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
    <div className="flex w-full justify-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="card w-full max-w-sm overflow-hidden border border-base-content/10 bg-base-100 shadow-2xl shadow-base-content/10 transition-transform duration-300 hover:-translate-y-1 sm:max-w-md">
        <figure className="relative aspect-4/5 overflow-hidden bg-base-300">
          <img
            src={photoUrl}
            alt={`${firstName} ${lastName}`}
            className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/75 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {firstName} {lastName}
            </h2>
            {(age || gender) && (
              <p className="mt-1 text-sm font-medium text-white/80">
                {age && <span>{age}</span>}
                {gender && <span>{age ? `, ${gender}` : gender}</span>}
              </p>
            )}
          </div>
        </figure>
        <div className="card-body gap-5 p-5 sm:p-6">
          {about && (
            <p className="text-sm leading-6 text-base-content/70">{about}</p>
          )}
          {skills && (
            <div className="flex flex-wrap gap-2" aria-label="Skills">
              {(Array.isArray(skills) ? skills : [skills]).map((skill) => (
                <span
                  className="badge badge-outline border-primary/30 bg-primary/5 px-3 py-3 text-xs font-semibold text-primary"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {formFeed && (
            <div className="card-actions mt-1 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="btn btn-outline btn-error h-12 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => handleFeed("ignored", _id)}
                aria-label={`Pass on ${firstName} ${lastName}`}
              >
                Pass
              </button>
              <button
                type="button"
                className="btn btn-primary h-12 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => handleFeed("interested", _id)}
                aria-label={`Show interest in ${firstName} ${lastName}`}
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
