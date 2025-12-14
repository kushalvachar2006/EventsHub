import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLayout from '../components/common/PageLayout';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import HostDashboard from '../components/dashboard/HostDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const onNavigate = (key) => {
    const map = {
      // student
      events: '/events',
      registrations: '/my-registrations',
      // host
      'create-event': '/create-event',
      'my-events': '/my-events',
      // admin
      approvals: '/admin/approvals',
      // common
      dashboard: '/dashboard',
    };
    const target = map[key] || '/dashboard';
    navigate(target);
  };

  return (
    <PageLayout title="My Dashboard">
      {user.role === 'student' && <StudentDashboard user={user} onNavigate={onNavigate} />}
      {user.role === 'host' && <HostDashboard user={user} onNavigate={onNavigate} />}
      {user.role === 'admin' && <AdminDashboard user={user} onNavigate={onNavigate} />}
    </PageLayout>
  );
};

export default DashboardPage;