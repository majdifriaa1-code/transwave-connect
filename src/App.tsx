import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardPro from "./pages/DashboardPro";
import DashboardCitizenTransport from "./pages/DashboardCitizenTransport";
import DashboardCitizenSender from "./pages/DashboardCitizenSender";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingPage from "./pages/BookingPage";
import MessagesPage from "./pages/MessagesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard/pro" element={<DashboardPro />} />
            <Route path="/dashboard/citizen-transport" element={<DashboardCitizenTransport />} />
            <Route path="/dashboard/citizen-sender" element={<DashboardCitizenSender />} />
            <Route path="/booking/:tripId" element={<BookingPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
