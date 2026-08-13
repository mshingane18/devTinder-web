import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";
import Notification from "./Notification";

const EditProfile = ({ user }) => {
  const { firstName, lastName, age, gender, about, photoUrl, skills } = user;

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName,
    lastName,
    age: age || "",
    gender: gender || "",
    about,
    photoUrl,
    skills: skills.join(", "),
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const myProfile = useSelector((store) => store.user);

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };
      const res = await axios.patch(BASE_URL + "/profile/edit", formData, {
        withCredentials: true,
      });
      dispatch(addUser(res.data?.data));
      setSuccess(res.data?.message);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  return (
    <div className="flex justify-center gap-10">
      <div className="flex justify-center">
        <div className="card w-96 shadow-lg mt-5 bg-gray-600">
          <div className="card-body">
            <h2 className="card-title text-white font-bold justify-center">
              Edit Profile
            </h2>
            <div>
              <fieldset className="fieldset">
                <label className="label text-gray-200" htmlFor="firstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="input input-neutral"
                  value={formData.firstName}
                  placeholder="first name"
                  onChange={handleOnchange}
                />
                <label className="label text-gray-200" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="input input-neutral"
                  value={formData.lastName}
                  placeholder="last name"
                  onChange={handleOnchange}
                />
                <label className="label text-gray-200" htmlFor="age">
                  Age
                </label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  className="input input-neutral"
                  value={formData.age}
                  placeholder="age"
                  onChange={handleOnchange}
                />
                <label className="label text-gray-200" htmlFor="gender">
                  Gender
                </label>
                <select
                  className="select select-neutral"
                  name="gender"
                  value={formData.gender}
                  onChange={handleOnchange}
                >
                  <option value="" disabled={true}>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <label className="label text-gray-200" htmlFor="password">
                  Photo Url
                </label>
                <input
                  type="text"
                  id="photoUrl"
                  name="photoUrl"
                  className="input input-neutral"
                  value={formData.photoUrl}
                  placeholder="photoUrl"
                  onChange={handleOnchange}
                />
                <label className="label text-gray-200" htmlFor="password">
                  About
                </label>
                <textarea
                  id="about"
                  name="about"
                  className="textarea textarea-neutral"
                  maxLength={150}
                  value={formData.about}
                  placeholder="about"
                  onChange={handleOnchange}
                ></textarea>
                <label className="label text-gray-200" htmlFor="password">
                  Skills
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  className="input input-neutral"
                  value={formData.skills}
                  placeholder="skills"
                  onChange={handleOnchange}
                />
              </fieldset>
            </div>
            <div className="card-actions justify-center mt-2">
              <button
                className="btn btn-dash btn-success"
                onClick={handleSaveProfile}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <UserCard formFeed={false} user={formData} />
      {success && <Notification type="success" message={success} />}

      {error && <Notification type="error" message={error} />}
    </div>
  );
};
export default EditProfile;
