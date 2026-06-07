import { useState, useContext } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../../services/authApi";
import { AuthContext } from "../../context/AuthContext";
import TravelHero from "../../components/auth/TravelHero";
import logo from "../../assets/logo.jpeg";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await registerUser(formData);

      toast.success("Account created! Please verify your email to continue.");

      navigate("/verify-email-notice");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* LEFT — TRAVEL HERO PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-auth-hero">
        {/* Decorative blurred blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] bg-purple-400/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl" />

        {/* Sparkle dots */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[18%] left-[22%] w-1.5 h-1.5 bg-white/70 rounded-full" />
          <div className="absolute top-[28%] right-[28%] w-1 h-1 bg-white/60 rounded-full" />
          <div className="absolute top-[55%] left-[15%] w-1 h-1 bg-white/50 rounded-full" />
          <div className="absolute top-[68%] right-[18%] w-1.5 h-1.5 bg-white/40 rounded-full" />
          <div className="absolute top-[40%] left-[45%] w-1 h-1 bg-white/50 rounded-full" />
        </div>

        {/* Content stack */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white w-full">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Buddy Finder"
              className="w-11 h-11 rounded-xl object-cover shadow-lg ring-2 ring-white/30"
            />
            <span className="text-xl font-bold tracking-wide">
              Buddy Finder
            </span>
          </div>

          {/* Center: Illustration + headline */}
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4 my-6">
            <div className="w-full max-w-md mb-6 animate-float-slow">
              <TravelHero />
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
              Find your perfect
              <br />
              travel buddy
            </h1>
            <p className="text-base xl:text-lg text-white/85 mt-3 max-w-md leading-relaxed">
              Connect with fellow adventurers, plan trips together, and
              create memories that last a lifetime.
            </p>
          </div>

          {/* Stats footer */}
          <div className="flex items-center justify-center gap-6 xl:gap-10">
            <div className="text-center">
              <div className="text-2xl xl:text-3xl font-bold">10K+</div>
              <div className="text-xs xl:text-sm text-white/80 mt-0.5">
                Travelers
              </div>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <div className="text-2xl xl:text-3xl font-bold">500+</div>
              <div className="text-xs xl:text-sm text-white/80 mt-0.5">
                Trips planned
              </div>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <div className="text-2xl xl:text-3xl font-bold">50+</div>
              <div className="text-xs xl:text-sm text-white/80 mt-0.5">
                Countries
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — REGISTER FORM PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <img
              src={logo}
              alt="Buddy Finder"
              className="w-10 h-10 rounded-lg object-cover shadow"
            />
            <span className="text-lg font-bold text-slate-800">
              Buddy Finder
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Create your account
            </h2>
            <p className="text-slate-500 mt-1.5">
              Start your journey with Buddy Finder
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-slate-600 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent hover:opacity-80"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
