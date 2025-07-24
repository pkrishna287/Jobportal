import "./global.css";

import { Toaster } from "./components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JobDetails from "./pages/JobDetails";
import UserProfile from "./pages/UserProfile";
import AdminProfile from "./pages/AdminProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApplications from "./pages/AdminApplications";
import AdminJobPost from "./pages/AdminJobPost";
import Companies from "./pages/Companies";
import { AuthProvider, useAuth } from "./contexts/AuthContext";


const ProfileRoute = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {

    return <Index />;
  }

  // Show admin profile for admin users, user profile for regular users
  return isAdmin ? <AdminProfile /> : <UserProfile />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/profile" element={<ProfileRoute />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/jobs/new" element={<AdminJobPost />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
