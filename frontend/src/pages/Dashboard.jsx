import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    document.title = "Buddy Finder 🌍";
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')",
        }}
      >
        {/* TRANSLUCENT OVERLAY */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]" />
      </div>

      {/* FOOTER-PLACED CONTAINER */}
      <div className="absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 z-10 w-full px-6">

        {/* GLASS CARD */}
        <div className="mx-auto bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-8 md:p-12 text-center max-w-2xl w-full shadow-2xl">
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
            Adventure Awaits
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8">
            Find like-minded travel buddies and explore the world together.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/explore")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-full text-lg transition"
            >
              Explore Trips
            </button>

            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 font-semibold px-10 py-4 rounded-full text-lg transition"
              >
                Sign In
              </button>
            )}

            {user && (
              <button
                onClick={() => navigate("/profile")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold px-10 py-4 rounded-full text-lg transition"
              >
                My Profile
              </button>
            )}
          </div>
        </div>

        {/* FOOTNOTE */}
        <p className="mt-6 text-center text-white/70 text-sm">
          Join 2,000+ travelers worldwide
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
