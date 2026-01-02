import { useState, useContext } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser, resendVerificationEmail } from "../../services/authApi";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useContext(AuthContext);

  // 🔁 Redirect back to intended page (or dashboard)
  const from = location.state?.from?.pathname || "/";

  // ✅ Already logged in → redirect safely
  if (user) {
    return <Navigate to={from} replace />;
  }

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setShowResend(false);

    try {
      setLoading(true);

      const data = await loginUser(formData);
      login(data);

      toast.success("Welcome back 👋");

      // ✅ Navigate to previous page AFTER login
      navigate(from, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message || "Login failed. Try again.";

      toast.error(message);

      // 🔒 Email not verified
      if (status === 403) {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      return toast.error("Please enter your email first");
    }

    try {
      await resendVerificationEmail(formData.email);
      toast.success("Verification email sent 📧");
    } catch {
      toast.error("Failed to resend verification email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-slate-500 text-center mb-6">
          Login to find your travel buddy
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* 🔁 RESEND VERIFICATION */}
        {showResend && (
          <button
            onClick={handleResendVerification}
            className="mt-3 w-full text-sm text-blue-600 hover:underline"
          >
            Resend verification email
          </button>
        )}

        {/* FOOTER */}
        <p className="text-sm text-center text-slate-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
