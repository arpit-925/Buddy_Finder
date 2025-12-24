import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast"; // ✅ ADD THIS

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import NotFound from "./pages/NotFound";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import ExploreTrips from "./pages/ExploreTrips";
import CreateTrip from "./pages/CreateTrip";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import TripDetails from "./pages/TripDetails";
import EditTrip from "./pages/EditTrip";
import EditProfile from "./pages/EditProfile";

// Components & Layouts
import ProtectedRoute from "./components/common/ProtectedRoute";
import ProtectedLayout from "./layouts/ProtectedLayout";

// Styles
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const { user, loading } = useContext(AuthContext);

  // Prevent flicker while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* ✅ TOASTER MUST BE HERE */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" replace />}
        />

        {/* Email verification */}
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/explore" element={<ExploreTrips />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route path="/edit-trip/:id" element={<EditTrip />} />
            <Route path="/chat/:tripId" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
