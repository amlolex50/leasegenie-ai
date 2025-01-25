import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import CreateProperty from "./pages/CreateProperty";
import EditProperty from "./pages/EditProperty";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import CreateUnit from "./pages/CreateUnit";
import EditUnit from "./pages/EditUnit";
import UnitDetails from "./pages/UnitDetails";
import Leases from "./pages/Leases";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route 
                path="/auth" 
                element={
                  session ? <Navigate to="/dashboard" replace /> : <Auth />
                } 
              />
              <Route
                path="/dashboard"
                element={
                  session ? <Index /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/properties"
                element={
                  session ? <Properties /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/properties/create"
                element={
                  session ? <CreateProperty /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/properties/:id"
                element={
                  session ? <PropertyDetails /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/properties/:id/edit"
                element={
                  session ? <EditProperty /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/properties/:id/units/create"
                element={
                  session ? <CreateUnit /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/properties/:id/units/:unitId"
                element={
                  session ? <UnitDetails /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/properties/:id/units/:unitId/edit"
                element={
                  session ? <EditUnit /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/leases"
                element={
                  session ? <Leases /> : <Navigate to="/auth" replace />
                }
              />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;