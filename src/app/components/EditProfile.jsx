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
    <main className="mx-auto grid w-full max-w-6xl items-start gap-8 px-4 py-6 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:gap-12">
      <section className="card w-full border border-base-content/10 bg-base-100 shadow-xl shadow-base-content/5">
        <div className="card-body p-5 sm:p-8">
          <div className="mb-3 border-b border-base-content/10 pb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Account details
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              Edit profile
            </h1>
            <p className="mt-2 text-sm leading-6 text-base-content/60">
              Keep your developer profile current and easy to discover.
            </p>
          </div>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                className="label text-sm font-semibold text-base-content"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="input input-bordered w-full bg-base-200/50 transition-colors focus:border-primary focus:outline-primary"
                value={formData.firstName}
                placeholder="First name"
                onChange={handleOnchange}
              />
            </div>
            <div>
              <label
                className="label text-sm font-semibold text-base-content"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="input input-bordered w-full bg-base-200/50 transition-colors focus:border-primary focus:outline-primary"
                value={formData.lastName}
                placeholder="Last name"
                onChange={handleOnchange}
              />
            </div>
            <div>
              <label
                className="label text-sm font-semibold text-base-content"
                htmlFor="age"
              >
                Age
              </label>
              <input
                type="text"
                id="age"
                name="age"
                className="input input-bordered w-full bg-base-200/50 transition-colors focus:border-primary focus:outline-primary"
                value={formData.age}
                placeholder="Age"
                onChange={handleOnchange}
              />
            </div>
            <div>
              <label
                className="label text-sm font-semibold text-base-content"
                htmlFor="gender"
              >
                Gender
              </label>
              <select
                id="gender"
                className="select select-bordered w-full bg-base-200/50 transition-colors focus:border-primary focus:outline-primary"
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
            </div>
            <div className="sm:col-span-2">
              <label
                className="label text-sm font-semibold text-base-content"
                htmlFor="photoUrl"
              >
                Photo URL
              </label>
              <input
                type="text"
                id="photoUrl"
                name="photoUrl"
                className="input input-bordered w-full bg-base-200/50 transition-colors focus:border-primary focus:outline-primary"
                value={formData.photoUrl}
                placeholder="https://..."
                onChange={handleOnchange}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                className="label text-sm font-semibold text-base-content"
                htmlFor="about"
              >
                About
              </label>
              <textarea
                id="about"
                name="about"
                className="textarea textarea-bordered min-h-32 w-full bg-base-200/50 leading-6 transition-colors focus:border-primary focus:outline-primary"
                maxLength={150}
                value={formData.about}
                placeholder="Tell people what you build..."
                onChange={handleOnchange}
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <label
                className="label text-sm font-semibold text-base-content"
                htmlFor="skills"
              >
                Skills
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                className="input input-bordered w-full bg-base-200/50 transition-colors focus:border-primary focus:outline-primary"
                value={formData.skills}
                placeholder="React, Node.js, MongoDB"
                onChange={handleOnchange}
              />
              <p className="mt-2 text-xs text-base-content/50">
                Separate skills with commas.
              </p>
            </div>
          </fieldset>
          <div className="mt-3 border-t border-base-content/10 pt-5">
            <button
              type="button"
              className="btn btn-primary h-12 w-full rounded-xl text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              onClick={handleSaveProfile}
            >
              Save Profile
            </button>
          </div>
        </div>
      </section>
      <aside className="flex w-full flex-col items-center lg:sticky lg:top-6">
        <div className="mb-4 self-start">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-base-content/50">
            Live preview
          </p>
          <p className="mt-1 text-sm text-base-content/60">
            See how your profile appears to others.
          </p>
        </div>
        <UserCard formFeed={false} user={formData} />
      </aside>
      {success && <Notification type="success" message={success} />}

      {error && <Notification type="error" message={error} />}
    </main>
  );
};
export default EditProfile;
