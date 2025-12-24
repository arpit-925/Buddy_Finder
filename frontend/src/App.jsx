import { Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/Dashboard";
import ExploreTrips from "./pages/ExploreTrips";
import CreateTrip from "./pages/CreateTrip";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import TripDetails from "./pages/TripDetails";
import EditTrip from "./pages/EditTrip";
import EditProfile from "./pages/EditProfile";

import ProtectedRoute from "./components/common/ProtectedRoute";
import ProtectedLayout from "./layouts/ProtectedLayout";

import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* ================= PROTECTED ================= */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
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
  );
}

export default App;
