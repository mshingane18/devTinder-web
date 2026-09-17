import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import { getProfileCompleteness } from "../utils/profileCompleteness";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const profile = getProfileCompleteness(user);
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200/20 pb-20">
      {user && (
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
          <div className="rounded-2xl border border-base-content/10 bg-base-100 p-4 shadow-lg shadow-base-content/5 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-base-content">
                  Profile completeness
                </p>
                <p className="text-xs text-base-content/60">
                  Complete your profile to make stronger connections.
                </p>
              </div>
              <span className="text-sm font-bold text-primary">
                {profile.percentage}%
              </span>
            </div>
            <progress
              className="progress progress-primary mt-3 w-full"
              value={profile.percentage}
              max="100"
            />
          </div>
        </div>
      )}
      {user && <EditProfile user={user} />}
    </main>
  );
};
export default Profile;
