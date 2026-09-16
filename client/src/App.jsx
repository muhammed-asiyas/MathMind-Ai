import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Lessons from "./pages/Lessons";
import TopicDetails from "./pages/student/TopicDetails";
import Profile from "./pages/Profile";
import AITutor from "./pages/student/AITutor";
import StudyHub from "./pages/StudyHub";
import Admin from "./pages/Admin";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
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
          path="/lessons"
          element={
            <ProtectedRoute>
              <Lessons />
            </ProtectedRoute>
          }
        />

        <Route
          path="/topics/:topicId"
          element={
            <ProtectedRoute>
              <TopicDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/topics/:topicId/subtopics/:lessonId"
          element={
            <ProtectedRoute>
              <TopicDetails />
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
          path="/study-hub"
          element={
            <ProtectedRoute>
              <StudyHub />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-tutor"
          element={
            <ProtectedRoute>
              <AITutor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
