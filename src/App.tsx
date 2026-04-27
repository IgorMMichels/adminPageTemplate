import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Landing
import Landing from "./pages/Landing";

// Admin imports
import {
  AdminProvider,
  AdminLayout,
  AdminLogin,
  AdminDashboard,
  AdminProducts,
  AdminMessages,
  AdminSettings,
  AdminClients,
  AdminSuppliers,
  AdminServices,
  AdminServiceImages,
  AdminChangePassword,
  AdminCategories,
} from "./admin";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="suppliers" element={<AdminSuppliers />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="service-images" element={<AdminServiceImages />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="change-password" element={<AdminChangePassword />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
