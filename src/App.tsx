import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardPro from "./pages/DashboardPro";
import DashboardCitizenTransport from "./pages/DashboardCitizenTransport";
import DashboardCitizenSender from "./pages/DashboardCitizenSender";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingPage from "./pages/BookingPage";
import MessagesPage from "./pages/MessagesPage";
import PublishDeparturePage from "./pages/ProTransporter/PublishDeparturePage";
import AddVehiclePage from "./pages/ProTransporter/AddVehiclePage";
import EditVehiclePage from "./pages/ProTransporter/EditVehiclePage";
import DepartureDetailPage from "./pages/ProTransporter/DepartureDetailPage";
import VehicleManagementPage from "./pages/ProTransporter/VehicleManagementPage";
import PickupManagementPage from "./pages/ProTransporter/PickupManagementPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard/pro" element={<DashboardPro />} />
              <Route path="/dashboard-pro" element={<DashboardPro />} />
              <Route path="/dashboard/citizen-transport" element={<DashboardCitizenTransport />} />
              <Route path="/dashboard/citizen-sender" element={<DashboardCitizenSender />} />
              <Route path="/booking/:tripId" element={<BookingPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              
              {/* Professional Transporter Routes */}
              <Route path="/pro-transporter/publish-departure" element={<PublishDeparturePage />} />
              <Route path="/vehicles" element={<VehicleManagementPage />} />
              <Route path="/add-vehicle" element={<AddVehiclePage />} />
              <Route path="/edit-vehicle/:vehicleId" element={<EditVehiclePage />} />
              <Route path="/pickup-locations" element={<PickupManagementPage />} />
              <Route path="/pro-transporter/vehicles" element={<VehicleManagementPage />} />
              <Route path="/pro-transporter/add-vehicle" element={<AddVehiclePage />} />
              <Route path="/pro-transporter/edit-vehicle/:vehicleId" element={<EditVehiclePage />} />
              <Route path="/pro-transporter/departure/:departureId" element={<DepartureDetailPage />} />
              
              {/* Catch-all - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
