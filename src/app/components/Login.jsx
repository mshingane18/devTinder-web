import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

import { Link, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import Notification from "./Notification";

const Login = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId: formData.email,
          password: formData.password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data?.data));
      navigate("/feed", {
        state: {
          success: res.data?.message,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailId: formData.email,
          password: formData.password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <>
      <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="w-full max-w-md rounded-3xl border border-base-content/10 bg-base-100 p-6 shadow-2xl shadow-base-content/10 sm:p-10">
          <div className="mx-auto w-full">
            <img
              alt="DevTinder Logo"
              src="/logo.png"
              className="mx-auto h-20 w-auto rounded-full object-contain ring-4 ring-primary/10 sm:h-24"
            />
            <p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Developer networking
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              {isLoginForm ? "Sign in to your account" : "Create a new account"}
            </h2>
          </div>

          <div className="mt-8">
            <form
              onSubmit={isLoginForm ? handleLogin : handleSignUp}
              className="space-y-5"
            >
              {!isLoginForm && (
                <>
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-base-content"
                    >
                      First Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        autoComplete="given-name"
                        className="input input-bordered h-12 w-full bg-base-200/50 text-base-content transition-colors placeholder:text-base-content/40 focus:border-primary focus:outline-primary"
                        onChange={handleOnchange}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-base-content"
                    >
                      Last Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        autoComplete="family-name"
                        className="input input-bordered h-12 w-full bg-base-200/50 text-base-content transition-colors placeholder:text-base-content/40 focus:border-primary focus:outline-primary"
                        onChange={handleOnchange}
                      />
                    </div>
                  </div>
                </>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-base-content"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="input input-bordered h-12 w-full bg-base-200/50 text-base-content transition-colors placeholder:text-base-content/40 focus:border-primary focus:outline-primary"
                    onChange={handleOnchange}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-base-content"
                  >
                    Password
                  </label>
                  {isLoginForm && (
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-semibold text-primary hover:text-primary/80"
                      >
                        Forgot password?
                      </a>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="input input-bordered h-12 w-full bg-base-200/50 text-base-content transition-colors placeholder:text-base-content/40 focus:border-primary focus:outline-primary"
                    onChange={handleOnchange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary h-12 w-full rounded-xl text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {isLoginForm ? "Sign in" : "Create account"}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm leading-6 text-base-content/60">
              Not a member?{" "}
              <Link
                onClick={() => setIsLoginForm(!isLoginForm)}
                className="font-semibold text-primary underline-offset-4 hover:text-primary/80 hover:underline"
              >
                {isLoginForm
                  ? "Create a new account here!"
                  : "Sign in to your existing account"}
              </Link>
            </p>
          </div>
          {error && <Notification message={error} type="error" />}
        </div>
      </main>
    </>
  );
};
export default Login;
