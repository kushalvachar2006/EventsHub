import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Home,
  List,
  Plus,
  Bell,
  LogOut,
  ChevronDown,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LuminaLogo from "./LuminaLogo";
import { notificationAPI } from "../../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const isActive = (path) => pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load unread notifications count
  const loadNotificationsCount = async () => {
    try {
      if (!user) {
        setUnreadCount(0);
        return;
      }
      const { data } = await notificationAPI.getNotifications();
      const list = Array.isArray(data?.notifications) ? data.notifications : [];
      if (user.role === "host") {
        setUnreadCount(
          list.filter((n) => !n.read && n.type === "registration").length
        );
      } else {
        setUnreadCount(list.filter((n) => !n.read).length);
      }
    } catch {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    loadNotificationsCount();
    // listen for updates from other pages/components
    window.addEventListener("notifications-updated", loadNotificationsCount);
    return () =>
      window.removeEventListener(
        "notifications-updated",
        loadNotificationsCount
      );
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <div className="group-hover:scale-105 transition-transform">
              <LuminaLogo size={40} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              EventsHub
            </span>
          </button>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {/* Primary nav for role */}
                {user.role === "student" ? (
                  <button
                    onClick={() => navigate("/notifications")}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isActive("/notifications")
                        ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-red-500 text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ) : null}

                {/* Host Notifications */}
                {user.role === "host" && (
                  <button
                    onClick={() => navigate("/host/notifications")}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isActive("/host/notifications")
                        ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-red-500 text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Student Registrations */}
                {user.role === "student" && (
                  <button
                    onClick={() => navigate("/my-registrations")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isActive("/my-registrations")
                        ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    Registrations
                  </button>
                )}

                {/* Host Create Event */}
                {user.role === "host" && (
                  <button
                    onClick={() => navigate("/create-event")}
                    className="px-4 py-2 btn-primary text-sm flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Event
                  </button>
                )}

                {/* Admin Approvals */}
                {user.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin/approvals")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isActive("/admin/approvals")
                        ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                    Approvals
                  </button>
                )}

                {/* User Dropdown */}
                <div className="relative ml-4" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all group"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-brand-cyan via-brand-violet to-brand-cyan rounded-2xl flex items-center justify-center shadow-xl glow-blue">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-200 hidden sm:block max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass-panel border border-white/10 shadow-2xl rounded-xl overflow-hidden animate-fade-in">
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-white/10 mb-1">
                          <p className="text-sm font-semibold text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-all flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            navigate("/dashboard");
                            setDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-all flex items-center gap-2"
                        >
                          <Home className="h-4 w-4" />
                          Dashboard
                        </button>
                        <div className="border-t border-white/10 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 text-slate-300 rounded-lg text-sm font-medium hover:bg-white/5 hover:text-white transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-2 btn-primary text-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 glass-panel">
          <div className="px-4 py-3 space-y-2">
            {user ? (
              <>
                {user.role === "student" ? (
                  <button
                    onClick={() => {
                      navigate("/notifications");
                      setMobileOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                      pathname === "/notifications"
                        ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                    Notifications
                  </button>
                ) : null}

                {user.role === "student" && (
                  <button
                    onClick={() => {
                      navigate("/my-registrations");
                      setMobileOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                      pathname === "/my-registrations"
                        ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    Registrations
                  </button>
                )}

                {user.role === "host" && (
                  <button
                    onClick={() => {
                      navigate("/create-event");
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium btn-primary"
                  >
                    <Plus className="h-4 w-4" />
                    Create Event
                  </button>
                )}

                {user.role === "admin" && (
                  <button
                    onClick={() => {
                      navigate("/admin/approvals");
                      setMobileOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                      pathname === "/admin/approvals"
                        ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                    Approvals
                  </button>
                )}

                <div className="border-t border-white/10 pt-2 mt-2" />

                <button
                  onClick={() => {
                    navigate("/profile");
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg btn-primary"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
