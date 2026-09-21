import { useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { BASE_URL } from "../utils/constants";
import Notification from "./Notification";
import Loader from "./Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const res = await axios.post(BASE_URL + "/forgot-password", {
        emailId: email,
      });
      setMessage(res.data?.message);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send reset link.");
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
            Forgot your password?
          </h1>
          <p className="mt-3 text-center text-sm leading-6 text-base-content/60">
            Enter your email and we will send you a secure reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="reset-email"
              className="block text-sm font-semibold text-base-content"
            >
              Email address
            </label>
            <input
              id="reset-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              <Loader size="sm" text="Sending reset link..." />
            ) : (
              "Send reset link"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm leading-6 text-base-content/60">
          Remembered your password?{" "}
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

export default ForgotPassword;
