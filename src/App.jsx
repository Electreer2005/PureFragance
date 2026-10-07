// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// Contextos
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
// Hooks
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './routes/ProtectedRoute';
//Componentes
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Loading from './Components/Loading/Loading';
// Pantallas
import Welcome from './Pages/Welcome/Welcome';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword'
import Home from './Pages/Home/Home';
import Products from './Pages/Products/Products';
import ProductDetail from './Pages/ProductDetail/ProductDetail';
import Cart from './Pages/Cart/Cart';
import Checkout from './Pages/Checkout/Checkout';
import OrderSuccess from './Pages/OrderSuccess/OrderSuccess';
import Orders from './Pages/Orders/Orders';
import Favorites from './Pages/Favorites/Favorites';
import Settings from './Pages/Settings/Settings';
import Profile from './Pages/Profile/Profile';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';
import AdminRoute from './routes/AdminRoute';
import AdminLayout from './Pages/Admin/AdminLayout';
import Dashboard from './Pages/Admin/Dashboard';
import AdminProducts from './Pages/Admin/AdminProducts';
import AdminProductForm from './Pages/Admin/AdminProductForm';
import AdminOrders from './Pages/Admin/AdminOrders';
import AdminCoupons from './Pages/Admin/AdminCoupons';
import InstallApp from './Components/InstallApp/InstallApp';
import Pending from './Pages/Checkout/Pending';
// estilos
import Seo from './Components/Seo/Seo';
import './App.css';
import './Animaciones.css';

// ============================================================
// Layout privado (con Header)
// ============================================================
function PrivateLayout() {
  return (
    <>
      <Header />
      <main className="Container">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<OrderSuccess />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/configuracion" element={<Settings />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/acerca" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/checkout/pending" element={<Pending />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
// ============================================================
// Redirige "/" según si hay sesión o no
// ============================================================
function RootRedirect() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return (
    <Loading />
  );

  // Si hay sesión (invitado o real) → al home privado
  if (isLoggedIn) return <Navigate to="/home" replace />;

  // Si no hay sesión → a Welcome
  return <Welcome />;
}

function AppContent() {
  return (
    <Routes>
      {/* Raíz: decide Welcome o redirige a /home */}
      <Route path="/" element={<RootRedirect />} />

      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="productos/nuevo" element={<AdminProductForm />} />
          <Route
            path="productos/:id/editar"
            element={<AdminProductForm />}
          />
          <Route path="pedidos" element={<AdminOrders />} />
          <Route path="cupones" element={<AdminCoupons />} />
        </Route>
      </Route>

      {/* Rutas protegidas (invitado o usuario real) */}
      <Route element={<ProtectedRoute allowGuest />}>
        <Route path="/*" element={<PrivateLayout />} />
      </Route>

      {/* Cualquier otra ruta → raíz */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <div className="App-container">
              <Router>
                <Seo />
                <AppContent />
                <InstallApp />
              </Router>
              {/* 👇 Toaster global */}
              <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={12}
                toastOptions={{
                  duration: 3500,
                  style: {
                    background: 'var(--color-bg-elevated)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    padding: '12px 16px',
                    boxShadow: 'var(--shadow-lg)',
                  },
                  success: {
                    iconTheme: {
                      primary: 'var(--success)',
                      secondary: '#fff',
                    },
                    style: {
                      borderLeft: '3px solid var(--success)',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: 'var(--color-primary)',
                      secondary: '#fff',
                    },
                    style: {
                      borderLeft: '3px solid var(--color-primary)',
                    },
                    duration: 4500,
                  },
                  loading: {
                    iconTheme: {
                      primary: 'var(--gold-500)',
                      secondary: 'var(--neutral-900)',
                    },
                  },
                }}
              />
            </div>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
