import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface PrivateRouteProps {
  children: React.ReactElement;
  requiredRole?: UserRole;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { signed, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!signed) {
    return <Navigate to="/sistema/login" replace />;
  }

  if (requiredRole && user?.perfil !== requiredRole) {
    // Redireciona para o dashboard correto baseado no perfil
    const redirectPath = user?.perfil === UserRole.ADMIN ? '/sistema/admin' : '/sistema/operator';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PrivateRoute;
