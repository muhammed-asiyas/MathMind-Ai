import { useEffect } from "react";
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
import Chat from "./pages/Chat";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import PublicRoute from "./components/PublicRoute";
import ScrollEffects from "./components/ScrollEffects";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

function App() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return undefined;

    let frameId = 0;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    let activeTiltSurface = null;

    const resetTiltSurface = () => {
      if (!activeTiltSurface) return;
      activeTiltSurface.style.setProperty("--tilt-x", "0deg");
      activeTiltSurface.style.setProperty("--tilt-y", "0deg");
      activeTiltSurface.classList.remove("is-pointer-tilting");
      activeTiltSurface = null;
    };

    const animatePointerGlow = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      document.documentElement.style.setProperty("--pointer-x", `${currentX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${currentY}px`);

      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        frameId = window.requestAnimationFrame(animatePointerGlow);
      } else {
        frameId = 0;
      }
    };

    const handlePointerMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      document.documentElement.classList.add("has-pointer-glow");

      const tiltSurface = event.target.closest?.(".cursor-tilt, .motion-surface");
      if (activeTiltSurface !== tiltSurface) {
        resetTiltSurface();
        activeTiltSurface = tiltSurface;
      }

      if (tiltSurface) {
        const bounds = tiltSurface.getBoundingClientRect();
        const horizontalPosition = (event.clientX - bounds.left) / bounds.width;
        const verticalPosition = (event.clientY - bounds.top) / bounds.height;
        const maxTilt = tiltSurface.classList.contains("cursor-tilt") ? 9 : 5;
        tiltSurface.style.setProperty("--tilt-x", `${(0.5 - verticalPosition) * maxTilt}deg`);
        tiltSurface.style.setProperty("--tilt-y", `${(horizontalPosition - 0.5) * maxTilt * 1.25}deg`);
        tiltSurface.classList.add("is-pointer-tilting");
      }

      if (!frameId) frameId = window.requestAnimationFrame(animatePointerGlow);
    };

    const handlePointerLeave = () => {
      resetTiltSurface();
      document.documentElement.classList.remove("has-pointer-glow");
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.cancelAnimationFrame(frameId);
      resetTiltSurface();
      document.documentElement.classList.remove("has-pointer-glow");
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <ScrollEffects />
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

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
