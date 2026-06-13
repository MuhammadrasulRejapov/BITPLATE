import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth, UserRole } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { AppSidebar } from './components/layout/AppSidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tables from './pages/Tables';
import TableDetail from './pages/TableDetail';
import Kitchen from './pages/Kitchen';
import Billing from './pages/Billing';
import History from './pages/History';
import Reservations from './pages/Reservations';
import Combos from './pages/Combos';
import Users from './pages/Users';

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) {
  const { role } = useAuth();

  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();

  if (!role) return <>{children}</>;

  return (
    <div className="flex h-screen bg-[#16213e]">
      <div className="w-64 flex-shrink-0">
        <AppSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <AppLayout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Manager']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tables"
                element={
                  <ProtectedRoute allowedRoles={['Manager', 'Waiter']}>
                    <Tables />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tables/:id"
                element={
                  <ProtectedRoute allowedRoles={['Manager', 'Waiter']}>
                    <TableDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/kitchen"
                element={
                  <ProtectedRoute allowedRoles={['Manager', 'Chef']}>
                    <Kitchen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing/:orderId"
                element={
                  <ProtectedRoute allowedRoles={['Manager', 'Cashier']}>
                    <Billing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <ProtectedRoute allowedRoles={['Manager', 'Cashier']}>
                    <Billing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute allowedRoles={['Manager']}>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reservations"
                element={
                  <ProtectedRoute allowedRoles={['Manager', 'Waiter']}>
                    <Reservations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/combos"
                element={
                  <ProtectedRoute allowedRoles={['Manager', 'Waiter', 'Cashier', 'Chef']}>
                    <Combos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={['Manager']}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </AppLayout>
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
