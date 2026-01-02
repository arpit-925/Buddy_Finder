import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import logo from "../../assets/logo.jpeg";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { notifications, markAllRead } = useNotifications();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
      <div className="h-16 max-w-7xl mx-auto px-4 flex items-center justify-between">

        {/* LEFT — LOGO + NAME */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Buddy Finder Logo"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-lg font-semibold">Buddy Finder</span>
        </Link>

        {/* RIGHT — ALL MENU ITEMS */}
        <div className="hidden md:flex items-center gap-8 text-sm">

          <Link to="/explore" className="hover:text-sky-400">
            Explore Trips
          </Link>

          {user && (
            <Link
              to="/create-trip"
              className="bg-blue-500 px-4 py-1.5 rounded-full hover:bg-blue-600"
            >
              + Create Trip
            </Link>
          )}

          <Link to="/about" className="hover:text-sky-400">
            About
          </Link>

          {user && (
            <>
              <Link to="/profile" className="hover:text-sky-400">
                Profile
              </Link>

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
                      <p className="text-sm text-gray-500 p-3">
                        No notifications
                      </p>
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
                className="text-red-400 hover:text-red-500"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:text-sky-400">
                Login
              </Link>
              <Link to="/register" className="hover:text-sky-400">
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 px-4 pb-4 space-y-3">

          <Link to="/explore" className="block text-sm">
            Explore Trips
          </Link>

          {user && (
            <>
              <Link
                to="/create-trip"
                className="block bg-blue-500 px-4 py-2 rounded-full text-sm text-center"
              >
                + Create Trip
              </Link>

              <Link to="/profile" className="block text-sm">
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="block text-sm text-red-400"
              >
                Logout
              </button>
            </>
          )}

          <Link to="/about" className="block text-sm pt-2 border-t border-slate-600">
            About
          </Link>

          {!user && (
            <>
              <Link to="/login" className="block text-sm">
                Login
              </Link>
              <Link to="/register" className="block text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
