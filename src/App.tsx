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
import { EditorLayout } from "@/components/layout/EditorLayout";
import { SalesLayout } from "@/components/layout/SalesLayout";

// User Pages
import { HomePage } from "@/pages/user/HomePage";
import { TopicDetailPage } from "@/pages/user/TopicDetailPage";
import { ContentDetailPage } from "@/pages/user/ContentDetailPage";
import { ProfileSettingsPage } from "@/pages/user/ProfileSettingsPage";

// Admin Pages
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminTopicsPage } from "@/pages/admin/AdminTopicsPage";
import { AdminContentPage } from "@/pages/admin/AdminContentPage";
import { AdminSoftwarePage } from "@/pages/admin/AdminSoftwarePage";
import { AdminImagesPage } from "@/pages/admin/AdminImagesPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminBannersPage } from "@/pages/admin/AdminBannersPage";

// Editor Pages
import { EditorContentLibraryPage } from "@/pages/editor/EditorContentLibraryPage";
import { EditorMyContentPage } from "@/pages/editor/EditorMyContentPage";
import { EditorCreateContentPage } from "@/pages/editor/EditorCreateContentPage";

// Sales Pages
import { SalesContentLibraryPage } from "@/pages/sales/SalesContentLibraryPage";

// Auth Pages
import { AuthPage } from "@/pages/AuthPage";
import { AccessDeniedPage } from "@/pages/AccessDeniedPage";
import { WaitingRoomPage } from "@/pages/WaitingRoomPage";

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
              
              {/* Waiting Room - For pending accounts (must be protected but allow pending status) */}
              <Route path="/waiting-room" element={
                <ProtectedRoute allowPending={true}>
                  <WaitingRoomPage />
                </ProtectedRoute>
              } />
              
              {/* Public Routes - Homepage accessible to all (landing page) */}
              <Route element={
                <ProtectedRoute requireAuth={false}>
                  <UserLayout />
                </ProtectedRoute>
              }>
                <Route path="/home" element={<HomePage />} />
              </Route>

              {/* Protected Content Routes - Require auth */}
              <Route element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }>
                <Route path="/topics" element={<HomePage />} />
                <Route path="/topic/:id" element={<TopicDetailPage />} />
                <Route path="/content/:id" element={<ContentDetailPage />} />
                <Route path="/community" element={<HomePage />} />
              </Route>

              {/* Protected User Routes - Require auth */}
              <Route element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }>
                <Route path="/profile" element={<ProfileSettingsPage />} />
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
                <Route path="banners" element={<AdminBannersPage />} />
                <Route path="settings" element={<AdminDashboardPage />} />
              </Route>

              {/* Editor Routes - Only Editor can access */}
              <Route path="/editor" element={
                <ProtectedRoute requiredRoles={['editor']}>
                  <EditorLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/editor/library" replace />} />
                <Route path="library" element={<EditorContentLibraryPage />} />
                <Route path="create" element={<EditorCreateContentPage />} />
                <Route path="my-content" element={<EditorMyContentPage />} />
              </Route>

              {/* Sales Routes - Only Sales can access */}
              <Route path="/sales" element={
                <ProtectedRoute requiredRoles={['sales']}>
                  <SalesLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/sales/library" replace />} />
                <Route path="library" element={<SalesContentLibraryPage />} />
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
