import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import Notification from "./Notification";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnClick = async () => {
    try {
      const res = await axios.post(BASE_URL + "/signup", formData, {
        withCredentials: true,
      });
      setSuccess(res.data?.message);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="card bg-base-300 w-96 shadow-lg mt-5">
        <div className="card-body">
          <h2 className="card-title justify-center">SignUp</h2>
          <div>
            <fieldset className="fieldset">
              <label className="label" htmlFor="name">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="input input-neutral"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleOnchange}
              />
            </fieldset>
            <fieldset className="fieldset">
              <label className="label" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="input input-neutral"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleOnchange}
              />
            </fieldset>
            <fieldset className="fieldset">
              <label className="label" htmlFor="email">
                Email Id
              </label>
              <input
                type="email"
                id="email"
                name="emailId"
                className="input input-neutral"
                value={formData.emailId}
                placeholder="Enter email"
                onChange={handleOnchange}
              />
            </fieldset>
            <fieldset>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="input input-neutral"
                value={formData.password}
                placeholder="Enter password"
                onChange={handleOnchange}
              />
            </fieldset>
            {error && <p className="text-red-600">Error: {error}</p>}
          </div>
          <div className="card-actions justify-center mt-4">
            <button className="btn btn-primary" onClick={handleOnClick}>
              Submit
            </button>
          </div>
        </div>
      </div>
      {success && <Notification type="success" message={success} />}
    </div>
  );
};
export default SignUp;
