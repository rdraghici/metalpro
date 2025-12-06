import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { BackofficeAuthProvider } from "@/context/BackofficeAuthContext";
import { initializeGTM } from "@/lib/analytics/gtm";
import I18nProvider from "@/components/I18nProvider"; // I18n provider wrapper
import EstimateCartDrawer from "@/components/cart/EstimateCartDrawer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BackofficeProtectedRoute from "@/components/backoffice/BackofficeProtectedRoute";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import EstimateCart from "./pages/EstimateCart";
import RFQForm from "./pages/RFQForm";
import RFQConfirmation from "./pages/RFQConfirmation";
import BOMUpload from "./pages/BOMUpload";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Account from "./pages/Account";
import BackofficeLogin from "./pages/BackofficeLogin";
import BackofficeDashboard from "./pages/BackofficeDashboard";
import BackofficeRFQList from "./pages/BackofficeRFQList";
import BackofficeRFQDetail from "./pages/BackofficeRFQDetail";
import BackofficeRFQPricing from "./pages/BackofficeRFQPricing";
import BackofficeProductList from "./pages/BackofficeProductList";
import BackofficeProductForm from "./pages/BackofficeProductForm";
import CategoriesManagement from "./pages/CategoriesManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Initialize Google Tag Manager on app load
  useEffect(() => {
    initializeGTM();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <AuthProvider>
          <BackofficeAuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes - accessible by everyone */}
                  <Route path="/" element={<Index />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/catalog/:family" element={<CategoryPage />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<EstimateCart />} />
                  <Route path="/rfq" element={<RFQForm />} />
                  <Route path="/rfq/confirmation" element={<RFQConfirmation />} />
                  <Route path="/bom-upload" element={<BOMUpload />} />

                  {/* Auth Routes - public */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Protected Routes - require authentication */}
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    }
                  />

                  {/* Back-Office Routes */}
                  <Route path="/backoffice/login" element={<BackofficeLogin />} />
                  <Route
                    path="/backoffice/dashboard"
                    element={
                      <BackofficeProtectedRoute>
                        <BackofficeDashboard />
                      </BackofficeProtectedRoute>
                    }
                  />
                  <Route
                    path="/backoffice/rfqs"
                    element={
                      <BackofficeProtectedRoute>
                        <BackofficeRFQList />
                      </BackofficeProtectedRoute>
                    }
                  />
                  <Route
                    path="/backoffice/rfqs/:id"
                    element={
                      <BackofficeProtectedRoute>
                        <BackofficeRFQDetail />
                      </BackofficeProtectedRoute>
                    }
                  />
                  <Route
                    path="/backoffice/rfqs/:id/pricing"
                    element={
                      <BackofficeProtectedRoute>
                        <BackofficeRFQPricing />
                      </BackofficeProtectedRoute>
                    }
                  />
                  <Route
                    path="/backoffice/products"
                    element={
                      <BackofficeProtectedRoute>
                        <BackofficeProductList />
                      </BackofficeProtectedRoute>
                    }
                  />
                  <Route
                    path="/backoffice/products/new"
                    element={
                      <BackofficeProtectedRoute>
                        <BackofficeProductForm />
                      </BackofficeProtectedRoute>
                    }
                  />
                  <Route
                    path="/backoffice/products/:id/edit"
                    element={
                      <BackofficeProtectedRoute>
                        <BackofficeProductForm />
                      </BackofficeProtectedRoute>
                    }
                  />
                  <Route
                    path="/backoffice/categories"
                    element={
                      <BackofficeProtectedRoute>
                        <CategoriesManagement />
                      </BackofficeProtectedRoute>
                    }
                  />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                {/* Global Cart Drawer - accessible from all pages */}
                <EstimateCartDrawer />
              </BrowserRouter>
            </CartProvider>
          </BackofficeAuthProvider>
        </AuthProvider>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
  );
};

export default App;
