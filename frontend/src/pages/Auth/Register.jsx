import { useState, useContext } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../../services/authApi";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // 🔐 If already logged in → dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    await registerUser(formData);
    
    // Flash the message
    toast.success("Account created! Please verify your email to continue.");
    
    // Move to login page while they wait for the email
    navigate("/login"); 
  } catch (err) {
    toast.error(err.response?.data?.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-2">
          Create Account
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Start your journey with Buddy Finder
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            className="input"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
