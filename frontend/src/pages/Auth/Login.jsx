import { useState, useContext } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser, resendVerificationEmail } from "../../services/authApi";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/logo.jpeg";

const TravelHero = () => (
  <svg
    viewBox="0 0 500 400"
    className="w-full h-auto drop-shadow-2xl"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF3C7" stopOpacity="1" />
        <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="skyFade" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Sun */}
    <g className="animate-sun" style={{ transformOrigin: "400px 115px" }}>
      <circle cx="400" cy="115" r="78" fill="url(#sunGlow)" />
      <circle cx="400" cy="115" r="32" fill="#FEF9C3" />
    </g>

    {/* Clouds */}
    <g opacity="0.55">
      <ellipse cx="115" cy="100" rx="32" ry="9" fill="white" />
      <ellipse cx="95" cy="96" rx="18" ry="7" fill="white" />
      <ellipse cx="135" cy="96" rx="14" ry="6" fill="white" />
    </g>
    <g opacity="0.4">
      <ellipse cx="270" cy="55" rx="22" ry="6" fill="white" />
      <ellipse cx="290" cy="52" rx="14" ry="5" fill="white" />
    </g>

    {/* Paper plane */}
    <g transform="translate(70, 140) rotate(-12)" opacity="0.85">
      <path d="M 0 0 L 32 6 L 14 12 L 8 22 Z" fill="white" />
      <path d="M 14 12 L 32 6 L 22 16 Z" fill="white" fillOpacity="0.55" />
      <path d="M 8 22 L 14 12 L 18 18 Z" fill="white" fillOpacity="0.7" />
    </g>

    {/* Distant mountains */}
    <path
      d="M 0 270 L 95 175 L 175 245 L 255 155 L 335 225 L 415 165 L 500 235 L 500 400 L 0 400 Z"
      fill="white"
      fillOpacity="0.18"
    />

    {/* Middle mountains */}
    <path
      d="M 0 315 L 75 235 L 155 295 L 235 215 L 335 285 L 415 235 L 500 275 L 500 400 L 0 400 Z"
      fill="white"
      fillOpacity="0.3"
    />

    {/* Front mountains */}
    <path
      d="M 0 355 L 55 285 L 135 335 L 215 275 L 315 345 L 395 295 L 500 335 L 500 400 L 0 400 Z"
      fill="white"
      fillOpacity="0.48"
    />

    {/* Sky fade overlay */}
    <rect x="0" y="0" width="500" height="280" fill="url(#skyFade)" />

    {/* Dashed journey path */}
    <path
      d="M 110 400 Q 200 380 250 360 T 400 335"
      stroke="white"
      strokeWidth="2"
      strokeDasharray="5 6"
      strokeOpacity="0.5"
      fill="none"
    />

    {/* Location pin */}
    <g transform="translate(360, 200)" opacity="0.9">
      <path
        d="M 0 0 C -7 0 -12 5 -12 12 C -12 20 0 30 0 30 C 0 30 12 20 12 12 C 12 5 7 0 0 0 Z"
        fill="white"
      />
      <circle cx="0" cy="11" r="4" fill="#EC4899" />
    </g>

    {/* Traveler 1 — with backpack and walking stick */}
    <g transform="translate(195, 235)">
      <path d="M -14 25 L -11 70 L 11 70 L 14 25 Z" fill="#1E1B4B" />
      <circle cx="0" cy="13" r="12" fill="#FED7AA" />
      <path
        d="M -12 11 Q -12 0 0 0 Q 12 0 12 11 L 12 8 Q 6 5 0 5 Q -6 5 -12 8 Z"
        fill="#1E1B4B"
      />
      <rect x="-22" y="28" width="10" height="22" rx="3" fill="#F97316" />
      <circle cx="-17" cy="38" r="1.8" fill="#FBBF24" />
      <rect x="-7" y="67" width="5" height="18" rx="1" fill="#312E81" />
      <rect x="2" y="67" width="5" height="18" rx="1" fill="#312E81" />
      <line
        x1="14"
        y1="35"
        x2="18"
        y2="88"
        stroke="#92400E"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>

    {/* Traveler 2 — companion */}
    <g transform="translate(290, 240)">
      <path d="M -14 25 L -11 68 L 11 68 L 14 25 Z" fill="#7C3AED" />
      <circle cx="0" cy="13" r="12" fill="#FECACA" />
      <path
        d="M -12 11 Q -12 -2 0 -2 Q 12 -2 12 11 L 12 17 Q 8 20 0 20 Q -8 20 -12 17 Z"
        fill="#7C2D12"
      />
      <rect x="12" y="26" width="10" height="22" rx="3" fill="#10B981" />
      <circle cx="17" cy="36" r="1.8" fill="#FBBF24" />
      <rect x="-7" y="65" width="5" height="18" rx="1" fill="#312E81" />
      <rect x="2" y="65" width="5" height="18" rx="1" fill="#312E81" />
    </g>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useContext(AuthContext);

  const from = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  if (user) {
    return <Navigate to={from} replace />;
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

    setShowResend(false);

    try {
      setLoading(true);

      const data = await loginUser(formData);
      login(data);

      toast.success("Welcome back");

      navigate(from, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message || "Login failed. Try again.";

      toast.error(message);

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
      toast.success("Verification email sent");
    } catch {
      toast.error("Failed to resend verification email");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* ============== LEFT — TRAVEL HERO PANEL ============== */}
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

      {/* ============== RIGHT — LOGIN FORM PANEL ============== */}
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
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-1.5">
              Login to continue your journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Resend verification */}
          {showResend && (
            <button
              onClick={handleResendVerification}
              className="mt-4 w-full text-sm text-pink-600 hover:underline"
            >
              Resend verification email
            </button>
          )}

          {/* Footer */}
          <p className="text-sm text-center text-slate-600 mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent hover:opacity-80"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
