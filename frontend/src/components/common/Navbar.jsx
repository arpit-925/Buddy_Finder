import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import logo from "../../../public/logo.jpeg"; // 👈 IMPORT LOGO

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const { notifications, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="h-16 bg-gradient-to-r from-slate-800 to-slate-700 text-white flex items-center px-6 justify-between">
      
      {/* LOGO + BRAND */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="Buddy Finder Logo"
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="text-lg font-semibold">
          Buddy Finder
        </span>
      </Link>

      <div className="flex items-center gap-6 relative">
        <Link to="/explore" className="text-sm">Explore Trips</Link>

        <Link
          to="/create-trip"
          className="bg-blue-500 px-4 py-1.5 rounded-full text-sm"
        >
          + Create Trip
        </Link>

        <Link to="/profile" className="text-sm">Profile</Link>

        {/* 🔔 Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setOpen((prev) => !prev);
              markAllRead();
            }}
            className="relative text-lg"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow rounded-lg z-50">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 p-3">No notifications</p>
              ) : (
                notifications.map((n, index) => (
                  <div
                    key={index}
                    className="text-sm border-b p-3 last:border-none"
                  >
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-red-400"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
