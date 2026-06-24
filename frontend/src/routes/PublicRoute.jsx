import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Spinner from '../components/ui/Spinner';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950"><Spinner /></div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
