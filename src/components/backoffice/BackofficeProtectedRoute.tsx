import { Navigate, useLocation } from 'react-router-dom';
import { useBackofficeAuth } from '@/context/BackofficeAuthContext';

interface BackofficeProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Back-Office Protected Route Wrapper
 *
 * Redirects unauthenticated users to /backoffice/login
 * Only use this for back-office routes
 */
const BackofficeProtectedRoute: React.FC<BackofficeProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useBackofficeAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to backoffice login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/backoffice/login" state={{ from: location }} replace />;
  }

  // Render protected content
  return <>{children}</>;
};

export default BackofficeProtectedRoute;
