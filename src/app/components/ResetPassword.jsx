import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router";
import { BASE_URL } from "../utils/constants";
import Notification from "./Notification";
import Loader from "./Loader";

const isStrongPassword = (password) =>
  password.length >= 8 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Password and confirm password are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${BASE_URL}/reset-password/${token}`, {
        password,
      });
      setMessage(res.data?.message);
      window.setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-base-content/10 bg-base-100 p-6 shadow-2xl shadow-base-content/10 sm:p-10">
        <div className="mx-auto w-full">
          <img
            alt="DevTinder Logo"
            src="/logo.png"
            className="mx-auto h-20 w-auto rounded-full object-contain ring-4 ring-primary/10 sm:h-24"
          />
          <p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Account recovery
          </p>
          <h1 className="mt-2 text-center text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Set a new password
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-semibold text-base-content"
            >
              New password
            </label>
            <input
              id="new-password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered mt-2 h-12 w-full bg-base-200/50 text-base-content transition-colors placeholder:text-base-content/40 focus:border-primary focus:outline-primary"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-semibold text-base-content"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered mt-2 h-12 w-full bg-base-200/50 text-base-content transition-colors placeholder:text-base-content/40 focus:border-primary focus:outline-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="btn btn-primary h-12 w-full rounded-xl text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader size="sm" text="Resetting password..." />
            ) : (
              "Reset password"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm leading-6 text-base-content/60">
          <Link
            to="/login"
            className="font-semibold text-primary underline-offset-4 hover:text-primary/80 hover:underline"
          >
            Back to login
          </Link>
        </p>

        {message && <Notification message={message} type="success" />}
        {error && <Notification message={error} type="error" />}
      </div>
    </main>
  );
};

export default ResetPassword;
