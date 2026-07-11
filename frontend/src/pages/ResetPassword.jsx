import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-1">
          Set a new password
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          Choose a new password for your account.
        </p>

        {success ? (
          <p className="text-primary text-sm bg-primary/10 p-3 rounded-lg">
            Password updated! Redirecting you to login...
          </p>
        ) : (
          <>
            {error && (
              <p className="text-red-400 text-sm mb-4 bg-red-500/10 p-2 rounded">
                {error}
              </p>
            )}
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full mb-4 px-4 py-3 rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field w-full mb-6 px-4 py-3 rounded-lg"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
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

export default ResetPassword;
