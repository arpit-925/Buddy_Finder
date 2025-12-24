import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

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

  // Optional: Prevent flicker while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      {/* If user is logged in, redirect them away from Login/Register to Dashboard */}
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/register" 
        element={!user ? <Register /> : <Navigate to="/" replace />} 
      />
      
      {/* Verify Email must be public so it can be accessed from the email link */}
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* ================= PROTECTED ROUTES ================= */}
      {/* Everything inside this Route requires a valid user/token */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          {/* Dashboard is the default landing page for logged-in users */}
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

      {/* ================= 404 ROUTE ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;