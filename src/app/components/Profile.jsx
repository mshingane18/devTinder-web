import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200/20 pb-20">
      {user && <EditProfile user={user} />}
    </main>
  );
};
export default Profile;
