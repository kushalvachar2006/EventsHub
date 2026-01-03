import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider } from "./context/AuthContext.jsx";

// Common Components
import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";

// Auth Components
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

// Public Page Imports
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import EventListPage from "./pages/EventListPage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Protected Page Imports
import DashboardPage from "./pages/DashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// Student Page Imports
import MyRegistrationsPage from "./pages/MyRegistrationsPage.jsx";
import PermissionFormPage from "./pages/PermissionFormPage.jsx";
import StudentNotificationsPage from "./pages/StudentNotificationsPage.jsx";
import HostNotificationsPage from "./pages/HostNotificationsPage.jsx";
import StudentEventRegistrationPage from "./pages/StudentEventRegistrationPage.jsx";

// Host Page Imports
import CreateEventPage from "./pages/CreateEventPage.jsx";
import ManageMyEventsPage from "./pages/ManageMyEventsPage.jsx";
import EventRegistrationsPage from "./pages/EventRegistrationsPage.jsx";

// Admin Page Imports
import AdminApprovalPage from "./pages/AdminApprovalPage.jsx";
import AdminRequestDetailPage from "./pages/AdminRequestDetailPage.jsx";
import AdminApprovedPage from "./pages/AdminApprovedPage.jsx";

// Host Edit Page
import EditEventPage from "./pages/EditEventPage.jsx";
// Toasts
import { ToastProvider } from "./context/ToastContext.jsx";

function App() {
  useEffect(() => {
    // Always force dark mode - remove any light mode classes
    const root = document.documentElement;
    root.classList.add("dark");
    root.classList.remove("light");
    // Prevent system theme from overriding
    root.style.colorScheme = "dark";
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "rgba(10, 26, 47, 0.92)",
                color: "#FFFFFF",
                border: "1px solid rgba(0, 229, 255, 0.18)",
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.6)",
                borderRadius: "0.75rem",
                backdropFilter: "blur(12px)",
              },
            }}
          />
          <div className="flex flex-col min-h-screen app-background text-white">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/events" element={<EventListPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />

                {/* */}

                {/* Protected Routes (All Logged-in Users) */}
                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={["student", "host", "admin"]}
                    />
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>

                {/* Student-Only Routes */}
                <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
                  <Route
                    path="/my-registrations"
                    element={<MyRegistrationsPage />}
                  />
                  <Route
                    path="/permission-form/:regId"
                    element={<PermissionFormPage />}
                  />
                  <Route
                    path="/notifications"
                    element={<StudentNotificationsPage />}
                  />
                  <Route
                    path="/events/:id/register"
                    element={<StudentEventRegistrationPage />}
                  />
                </Route>

                {/* Host-Only Routes */}
                <Route element={<ProtectedRoute allowedRoles={["host"]} />}>
                  <Route path="/create-event" element={<CreateEventPage />} />
                  <Route path="/my-events" element={<ManageMyEventsPage />} />
                  <Route
                    path="/host/events/:eventId/registrations"
                    element={<EventRegistrationsPage />}
                  />
                  <Route
                    path="/host/events/:id/edit"
                    element={<EditEventPage />}
                  />
                  <Route
                    path="/host/notifications"
                    element={<HostNotificationsPage />}
                  />
                </Route>

                {/* Admin-Only Routes */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                  <Route
                    path="/admin/approvals"
                    element={<AdminApprovalPage />}
                  />
                  <Route
                    path="/admin/requests/:id"
                    element={<AdminRequestDetailPage />}
                  />
                  <Route
                    path="/admin/approved"
                    element={<AdminApprovedPage />}
                  />
                </Route>

                {/* 404 Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
