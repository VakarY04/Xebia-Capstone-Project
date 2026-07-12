import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Gender from "./pages/onboarding/Gender.jsx";
import BodyStats from "./pages/onboarding/BodyStats.jsx";
import Experience from "./pages/onboarding/Experience.jsx";
import Availability from "./pages/onboarding/Availability.jsx";
import MyDetails from "./pages/MyDetails.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MealPlan from "./pages/MealPlan.jsx";
import Stats from "./pages/Stats.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

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

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meal-plan"
        element={
          <ProtectedRoute>
            <MealPlan />
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
            <Stats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default App;
