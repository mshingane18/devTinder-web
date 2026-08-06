import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router";

const Login = () => {
  const [formData, setFormData] = useState({
    emailId: "maheshs@gmail.com",
    password: "mShingane@123",
  });
  const [error, setError] = useState("");

  const dispatch = useDispatch();
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
      const res = await axios.post(
        BASE_URL + "/login",
        {
          username: formData.emailId,
          password: formData.password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.user));
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="card bg-base-300 w-96 shadow-lg mt-5">
        <div className="card-body">
          <h2 className="card-title justify-center">Login!</h2>
          <div>
            <fieldset className="fieldset">
              <label className="label" htmlFor="email">
                Email Id
              </label>
              <input
                type="text"
                id="email"
                name="emailId"
                className="input input-primary"
                value={formData.emailId}
                placeholder="Email"
                onChange={handleOnchange}
              />
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                type="text"
                id="password"
                name="password"
                className="input input-primary"
                value={formData.password}
                placeholder="Password"
                onChange={handleOnchange}
              />
              {error && <p className="text-red-600">Error: {error}</p>}
            </fieldset>
          </div>
          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={handleOnClick}>
              LogIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
