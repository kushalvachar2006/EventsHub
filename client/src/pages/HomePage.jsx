import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/common/PageLayout";
import CollegeSelect from "../components/common/CollegeSelect";
import { useAuth } from "../context/AuthContext";

// Modern Icon Components
const StudentIcon = () => (
  <svg
    className="w-14 h-14 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443a55.381 55.381 0 015.25 2.882V15"
    />
  </svg>
);

const HostIcon = () => (
  <svg
    className="w-14 h-14 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 005.25 9h13.5A2.25 2.25 0 0021 11.25v7.5"
    />
  </svg>
);

const AdminIcon = () => (
  <svg
    className="w-14 h-14 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.42-.182-2.807-.523-4.036M12 2.748v-.001"
    />
  </svg>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="card-floating p-8 flex flex-col items-center text-center group hover:scale-[1.02] transition-all duration-500">
    <div className="gradient-primary p-5 rounded-2xl mb-6 group-hover:glow-blue transition-all shadow-xl">
      {icon}
    </div>
    <h3 className="heading-md text-white mb-3">
      {title}
    </h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const HomePage = () => {
  const [selectedCollege, setSelectedCollege] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl mb-16">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/15 via-brand-violet/20 to-brand-cyan/10"></div>
        
        {/* Animated Blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-cyan/18 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-violet/18 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Glass Panel Content */}
        <div className="relative z-10 glass-panel p-12 md:p-16 text-center">
          <h1 className="heading-xl text-white mb-6 animate-fade-in leading-tight">
            The <span className="text-gradient">Future</span> of
            <br className="hidden sm:block" />
            <span className="text-gradient">Events</span> is Here.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Discover, connect, and experience like never before. Your hub for the world's most electrifying gatherings.
          </p>
          
          <div className="max-w-md mx-auto mb-10 animate-slide-up">
            <label className="block text-sm font-medium text-slate-300 mb-4 text-left">
              Find events at your college
            </label>
            <CollegeSelect
              selected={selectedCollege}
              onChange={setSelectedCollege}
            />
          </div>
          
          <Link
            to={
              selectedCollege
                ? `/events?college=${selectedCollege.name}`
                : "/events"
            }
            className="inline-block btn-primary text-lg px-8 py-4 animate-slide-up"
          >
            Explore Events
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="heading-lg text-white mb-4">
            A Platform for Everyone
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Seamlessly connect students, event organizers, and administrators in
            one unified platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<StudentIcon />}
            title="For Students"
            description="Never miss an event. Browse a centralized list of all fests, workshops, and competitions. Register with one click and get HOD approval seamlessly."
          />
          <FeatureCard
            icon={<HostIcon />}
            title="For Event Hosts"
            description="Stop worrying about outreach. Publish your event to the entire college instantly. Manage registrations and select participants all in one place."
          />
          <FeatureCard
            icon={<AdminIcon />}
            title="For College Admins"
            description="Streamline the permission process. Receive and approve student requests for event participation through a simple, organized dashboard. No more paperwork!"
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
