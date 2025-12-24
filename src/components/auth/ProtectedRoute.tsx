import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, AppRole } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: AppRole[];
  requireAuth?: boolean;
  allowPending?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles,
  requireAuth = true,
  allowPending = false
}: ProtectedRouteProps) {
  const { user, role, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if user is authenticated
  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user account is locked
  if (profile?.status === 'locked') {
    return <Navigate to="/access-denied" state={{ reason: 'locked' }} replace />;
  }

  // Check if user account is pending activation (redirect to waiting room)
  // Skip this check if allowPending is true (for the waiting room page itself)
  // Also skip for admins who can always access the system
  if (user && profile?.status === 'pending' && !allowPending && role !== 'admin') {
    return <Navigate to="/waiting-room" replace />;
  }

  // Check if user has required role
  if (requiredRoles && requiredRoles.length > 0) {
    if (!role || !requiredRoles.includes(role)) {
      return <Navigate to="/access-denied" state={{ reason: 'role' }} replace />;
    }
  }

  return <>{children}</>;
}
