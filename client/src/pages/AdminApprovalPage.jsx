import React from 'react';
import PageLayout from '../components/common/PageLayout';
import ApprovalQueue from '../components/admin/ApprovalQueue';

const AdminApprovalPage = () => (
  <PageLayout title="Pending HoD Approvals">
    <ApprovalQueue />
  </PageLayout>
);

export default AdminApprovalPage;