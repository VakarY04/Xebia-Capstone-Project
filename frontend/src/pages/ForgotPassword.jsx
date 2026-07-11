import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "error"
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setStatus("sent");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-1">
          Forgot your password?
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          Enter your email and we'll send you a reset link.
        </p>

        {status === "sent" ? (
          <p className="text-primary text-sm bg-primary/10 p-3 rounded-lg">
            If that email is registered, a reset link has been sent. Check
            your inbox (and spam folder).
          </p>
        ) : (
          <>
            {error && (
              <p className="text-red-400 text-sm mb-4 bg-red-500/10 p-2 rounded">
                {error}
              </p>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full mb-6 px-4 py-3 rounded-lg"
              required
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-primary w-full py-3 rounded-lg disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}

        <p className="text-slate-400 text-sm mt-6 text-center">
          <Link to="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
