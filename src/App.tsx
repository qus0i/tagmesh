import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsManagePage from './pages/admin/ProductsManagePage';
import OrdersManagePage from './pages/admin/OrdersManagePage';
import DiscountCodesPage from './pages/admin/DiscountCodesPage';

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e1e1e',
            color: '#f5f5f5',
            borderRadius: '10px',
            border: '1px solid #2a2a2a',
            fontFamily: 'Cairo, sans-serif',
          },
          success: {
            iconTheme: { primary: '#c8a97e', secondary: '#0a0a0a' },
          },
        }}
      />
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
        <Route path="/products" element={<CustomerLayout><ProductsPage /></CustomerLayout>} />
        <Route path="/products/:id" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
        <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
        <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
        <Route path="/order-confirmation/:id" element={<CustomerLayout><OrderConfirmationPage /></CustomerLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsManagePage />} />
          <Route path="orders" element={<OrdersManagePage />} />
          <Route path="discounts" element={<DiscountCodesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
