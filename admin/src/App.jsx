import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminLayout from './components/layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import Category from './pages/Category'
import Collections from './pages/Collections'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Invoices from './pages/Invoices'
import Banners from './pages/Banners'
import PromoCodes from './pages/PromoCodes'
import Users from './pages/Users'
import Updates from './pages/Updates'
import FlashSales from './pages/FlashSales'
import BestSellers from './pages/BestSellers'
import Featured from './pages/Featured'
import Support from './pages/Support'
import SupportDetail from './pages/SupportDetail'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/new" element={<ProductForm />} />
                <Route path="/products/:id/edit" element={<ProductForm />} />
                <Route path="/category" element={<Category />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/banners" element={<Banners />} />
                <Route path="/promo-codes" element={<PromoCodes />} />
                <Route path="/users" element={<Users />} />
                <Route path="/updates" element={<Updates />} />
                <Route path="/flash-sales" element={<FlashSales />} />
                <Route path="/best-sellers" element={<BestSellers />} />
                <Route path="/featured" element={<Featured />} />
                <Route path="/support" element={<Support />} />
                <Route path="/support/:id" element={<SupportDetail />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
