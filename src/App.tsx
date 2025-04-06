import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppStore } from "@/store/store";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InsuranceList from "./pages/InsuranceList";
import Insurance from "./pages/Insurance";
import PurchaseInsurance from "./pages/PurchaseInsurance";
import ClaimsList from "./pages/ClaimsList";
import SubmitClaim from "./pages/SubmitClaim";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersList from "./pages/admin/UsersList";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* User Routes - Protected */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/insurance" element={<InsuranceList />} />
              <Route path="/insurance/:id" element={<Insurance />} />
              <Route path="/insurance/purchase" element={<PurchaseInsurance />} />
              <Route path="/claims" element={<ClaimsList />} />
              <Route path="/claims/new" element={<SubmitClaim />} />
              <Route path="/claims/new/:insuranceId" element={<SubmitClaim />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin Routes - Protected */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersList />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
