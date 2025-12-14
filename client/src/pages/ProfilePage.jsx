import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Building2, Edit } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy via-slate-950 to-brand-navy py-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-violet/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
            My Profile
          </h1>
          <p className="text-lg text-slate-400">
            View and manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 animate-slide-up overflow-y-auto max-h-[85vh]">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-cyan via-brand-violet to-brand-cyan rounded-2xl flex items-center justify-center shadow-xl glow-blue">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </label>
              <div className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-white">
                {user.name}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <div className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-white">
                {user.email}
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role
              </label>
              <div className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-white capitalize">
                {user.role}
              </div>
            </div>

            {/* College */}
            {user.college && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  College
                </label>
                <div className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-white">
                  {user.college}
                </div>
              </div>
            )}

            {/* Edit Button */}
            <button className="w-full mt-8 btn-primary py-4 px-6 text-base flex items-center justify-center gap-2 group">
              <Edit className="h-5 w-5" />
              <span>Edit Profile</span>
              <span className="text-sm opacity-75">(Coming Soon)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
