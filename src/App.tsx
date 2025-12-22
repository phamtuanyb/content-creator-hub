import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Layouts
import { UserLayout } from "@/components/layout/UserLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

// User Pages
import { HomePage } from "@/pages/user/HomePage";
import { TopicDetailPage } from "@/pages/user/TopicDetailPage";
import { ContentDetailPage } from "@/pages/user/ContentDetailPage";

// Admin Pages
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminTopicsPage } from "@/pages/admin/AdminTopicsPage";
import { AdminContentPage } from "@/pages/admin/AdminContentPage";
import { AdminSoftwarePage } from "@/pages/admin/AdminSoftwarePage";
import { AdminImagesPage } from "@/pages/admin/AdminImagesPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";

// Auth Pages
import { AuthPage } from "@/pages/AuthPage";
import { AccessDeniedPage } from "@/pages/AccessDeniedPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Redirect root to home */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              
              {/* Auth Routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/access-denied" element={<AccessDeniedPage />} />
              
              {/* User Routes - Accessible by all authenticated users */}
              <Route element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }>
                <Route path="/home" element={<HomePage />} />
                <Route path="/topics" element={<HomePage />} />
                <Route path="/topic/:id" element={<TopicDetailPage />} />
                <Route path="/content/:id" element={<ContentDetailPage />} />
                <Route path="/community" element={<HomePage />} />
              </Route>

              {/* Admin Routes - Only Admin can access */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="topics" element={<AdminTopicsPage />} />
                <Route path="content" element={<AdminContentPage />} />
                <Route path="software" element={<AdminSoftwarePage />} />
                <Route path="images" element={<AdminImagesPage />} />
                <Route path="analytics" element={<AdminDashboardPage />} />
                <Route path="settings" element={<AdminDashboardPage />} />
              </Route>

              {/* Editor Routes - Admin and Editor can access */}
              <Route path="/editor" element={
                <ProtectedRoute requiredRoles={['admin', 'editor']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="content" element={<AdminContentPage />} />
                <Route path="my-content" element={<AdminContentPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
