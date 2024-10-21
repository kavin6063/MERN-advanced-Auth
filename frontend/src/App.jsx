import React, { useEffect } from "react";
import FloatingShape from "./components/FloatingShape";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { Toaster } from "react-hot-toast";
import { setUser, setCheckingAuth, setAuthenticated } from "./slices/authSlice";
import { useCheckAuthMutation } from "./slices/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Protected Route component that checks if the user is authenticated and verified
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// RedirectAuthenticatedUser component that redirects authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const [checkAuth, { isLoading }] = useCheckAuthMutation();
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const result = await checkAuth().unwrap();
        dispatch(setUser(result.user)); // Populate user state
        dispatch(setAuthenticated(true)); // Set authenticated status
      } catch (error) {
        console.error("Authentication check failed:", error);
      }
    };

    fetchAuthStatus();
  }, [checkAuth, dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex flex-col justify-between relative overflow-hidden">
      {/* Header at the top */}
      <Header />

      <div className="flex-grow flex items-center justify-center relative">
        <FloatingShape
          color="bg-green-500"
          size="w-64 h-64"
          top="-5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-emerald-500"
          size="w-48 h-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <FloatingShape
          color="bg-lime-500"
          size="w-32 h-32"
          top="40%"
          left="-10%"
          delay={2}
        />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          {/* catch all routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Toaster />

      <Footer />
    </div>
  );
};

export default App;
