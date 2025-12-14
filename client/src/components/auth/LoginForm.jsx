import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import LuminaLogo from "../common/LuminaLogo.jsx";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      show("Please fill in all fields.", "error");
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      show("Login successful!", "success");
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      show(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs - brand */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-violet/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative group">
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <LuminaLogo size={80} />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-1xl font-bold text-white mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-lg text-slate-400">
            Sign in to continue to Lumina
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel p-8 md:p-10 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
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

            {/* Password Input */}
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
                              placeholder="Enter password"
                            />
                          </div>
                        </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 btn-primary py-4 px-6 text-base flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/5 text-slate-400">New to Lumina?</span>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            onClick={() => navigate("/register")}
            className="w-full py-3.5 px-6 btn-secondary flex items-center justify-center gap-2 group"
          >
            <span>Create an account</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          By signing in, you agree to our{" "}
          <a href="#" className="text-slate-400 hover:text-brand-cyan transition-colors">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-slate-400 hover:text-brand-cyan transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
