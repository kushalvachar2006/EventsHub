import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';

const NotFoundPage = () => (
  <PageLayout>
    <div className="text-center">
      <h1 className="text-6xl font-extrabold text-gradient">404</h1>
      <p className="text-2xl font-bold text-white mt-4 mb-2">Page Not Found</p>
      <p className="text-slate-300 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="btn-primary"
      >
        Go Home
      </Link>
    </div>
  </PageLayout>
);

export default NotFoundPage;