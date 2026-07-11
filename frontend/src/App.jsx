import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Gender from "./pages/onboarding/Gender.jsx";
import BodyStats from "./pages/onboarding/BodyStats.jsx";
import Experience from "./pages/onboarding/Experience.jsx";
import Availability from "./pages/onboarding/Availability.jsx";
import MyDetails from "./pages/MyDetails.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Onboarding - all 4 steps built */}
      <Route
        path="/onboarding/gender"
        element={
          <ProtectedRoute>
            <Gender />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/body-stats"
        element={
          <ProtectedRoute>
            <BodyStats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/experience"
        element={
          <ProtectedRoute>
            <Experience />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/availability"
        element={
          <ProtectedRoute>
            <Availability />
          </ProtectedRoute>
        }
      />

      {/* Main app */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ComingSoon title="Dashboard (Phase 3 - AI plan generation)" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-details"
        element={
          <ProtectedRoute>
            <MyDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ComingSoon title="Stats (Phase 4)" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ComingSoon title="Profile & Settings (Phase 4)" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default App;
