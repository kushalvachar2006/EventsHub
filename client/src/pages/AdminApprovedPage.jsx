import React from 'react';
import PageLayout from '../components/common/PageLayout';
import ApprovedList from '../components/admin/ApprovedList.jsx';

const AdminApprovedPage = () => (
  <PageLayout title="Approved Requests">
    <ApprovedList />
  </PageLayout>
);

export default AdminApprovedPage;
