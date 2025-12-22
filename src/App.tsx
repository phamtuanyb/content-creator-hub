import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* User Routes */}
          <Route element={<UserLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/topics" element={<HomePage />} />
            <Route path="/topic/:id" element={<TopicDetailPage />} />
            <Route path="/content/:id" element={<ContentDetailPage />} />
            <Route path="/community" element={<HomePage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="topics" element={<AdminTopicsPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="software" element={<AdminSoftwarePage />} />
            <Route path="images" element={<AdminImagesPage />} />
            <Route path="analytics" element={<AdminDashboardPage />} />
            <Route path="settings" element={<AdminDashboardPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
