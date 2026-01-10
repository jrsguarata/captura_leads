import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import OperatorDashboard from './pages/OperatorDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rota pública - Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Rota de login */}
        <Route path="/sistema/login" element={<Login />} />

        {/* Rotas protegidas - Admin */}
        <Route
          path="/sistema/admin/*"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Rotas protegidas - Operator */}
        <Route
          path="/sistema/operator/*"
          element={
            <PrivateRoute requiredRole="OPERATOR">
              <OperatorDashboard />
            </PrivateRoute>
          }
        />

        {/* Rota 404 */}
        <Route path="*" element={<div className="p-8 text-center">Página não encontrada</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
