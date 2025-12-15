import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext.jsx";
import CollegeSelect from "../common/CollegeSelect";
import {
  Mail,
  Lock,
  User,
  Building2,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import LuminaLogo from "../common/LuminaLogo.jsx";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [college, setCollege] = useState(null);
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !college) {
      show("Please fill in all fields, including your college.", "error");
      return;
    }
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        college: college.name,
        department,
      });
      show("Registration successful!", "success");
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed";
      show(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const roleIcons = {
    student: GraduationCap,
    host: Building2,
    admin: Building2,
  };

  const RoleIcon = roleIcons[role] || GraduationCap;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs - more subtle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow"></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <LuminaLogo size={80} />
              </div>
            </div>
          </div>
          <h1 className="heading-xl text-white mb-3">Join EventsHub</h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Create your account and start exploring events
          </p>
        </div>

        {/* Glass Card */}
        <div className="glass-panel p-8 md:p-10 animate-slide-up border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  disabled={loading}
                  className="input-field !pl-12"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  disabled={loading}
                  className="input-field !pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  disabled={loading}
                  className="input-field !pl-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            {/* College Select */}
            <CollegeSelect
              selected={college}
              onChange={(college) => setCollege(college)}
              disabled={loading}
            />

            {/* Department Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Department{" "}
                <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <GraduationCap className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  disabled={loading}
                  className="input-field !pl-12"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                I am a...
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <RoleIcon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <select
                  disabled={loading}
                  className="input-field !pl-12 appearance-none cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="host">Event Host</option>
                  <option value="admin">College Admin</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-base font-semibold flex items-center justify-center gap-2 group mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800/50 text-slate-400">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all duration-200 hover:border-white/20 flex items-center justify-center gap-2 group"
          >
            <span>Sign in instead</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-sm text-slate-500">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
