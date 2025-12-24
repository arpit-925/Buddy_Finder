import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
  document.title = "Buddy Finder 🌍";
}, []);


  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col justify-end items-center h-full pb-16 md:pb-24 px-6">
        <div className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl p-8 md:p-12 text-center max-w-2xl w-full shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            Adventure Awaits.
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8">
            Find your perfect travel buddies and explore the world together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* PRIMARY CTA */}
            <button
              onClick={() => navigate("/explore")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-full text-lg shadow-xl transition"
            >
              Get Started
            </button>

            {/* SHOW ONLY IF LOGGED OUT */}
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/50 font-bold px-10 py-4 rounded-full text-lg"
              >
                Sign In
              </button>
            )}

            {/* OPTIONAL: SHOW ONLY IF LOGGED IN */}
            {user && (
              <button
                onClick={() => navigate("/profile")}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/50 font-bold px-10 py-4 rounded-full text-lg"
              >
                My Profile
              </button>
            )}
          </div>
        </div>

        <p className="mt-8 text-white/60 text-sm">
          Join 2,000+ travelers worldwide
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
