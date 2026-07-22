import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import SplashScreen from './components/shared/SplashScreen';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ProductsList from './pages/products/ProductsList';
import AddProduct from './pages/products/AddProduct';
import ProductDetails from './pages/products/ProductDetails';
import EditProduct from './pages/products/EditProduct';
import UsersList from './pages/users/UsersList';

const queryClient = new QueryClient();

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <SplashScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'ADMIN') return <Navigate to="/products" replace />;

  return <>{children}</>;
};

function AppContent() {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/new" element={<AddProduct />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products/:id/edit" element={<EditProduct />} />
          
          <Route path="/users" element={<ProtectedRoute requireAdmin><UsersList /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="zuppa-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
