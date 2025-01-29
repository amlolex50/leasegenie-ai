import { Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Landing from "@/pages/Landing";
import Features from "@/pages/Features";
import HowItWorks from "@/pages/HowItWorks";
import Auth from "@/pages/Auth";
import ForgotPassword from "@/pages/ForgotPassword";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/PropertyDetails";
import CreateProperty from "@/pages/CreateProperty";
import EditProperty from "@/pages/EditProperty";
import CreateUnit from "@/pages/CreateUnit";
import EditUnit from "@/pages/EditUnit";
import UnitDetails from "@/pages/UnitDetails";
import Leases from "@/pages/Leases";
import CreateLease from "@/pages/CreateLease";
import LeaseDetails from "@/pages/LeaseDetails";
import Maintenance from "@/pages/Maintenance";
import Financials from "@/pages/Financials";
import AIAnalytics from "@/pages/AIAnalytics";
import Settings from "@/pages/Settings";
import ManageContractors from "@/pages/ManageContractors";
import ContractorDashboard from "@/pages/ContractorDashboard";
import ManageTenants from "@/pages/ManageTenants";
import TenantDashboard from "@/pages/TenantDashboard";

export const createRoutes = (session: any) => [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/features",
    element: <Features />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />,
  },
  {
    path: "/auth",
    element: session ? <Navigate to="/dashboard" replace /> : <Auth />,
  },
  {
    path: "/forgot-password",
    element: session ? <Navigate to="/dashboard" replace /> : <ForgotPassword />,
  },
  {
    path: "/dashboard",
    element: session ? <Index /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/settings",
    element: session ? <Settings /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/properties",
    element: session ? <Properties /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/properties/create",
    element: session ? <CreateProperty /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/properties/:id",
    element: session ? <PropertyDetails /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/properties/:id/edit",
    element: session ? <EditProperty /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/properties/:id/units/create",
    element: session ? <CreateUnit /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/properties/:id/units/:unitId",
    element: session ? <UnitDetails /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/properties/:id/units/:unitId/edit",
    element: session ? <EditUnit /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/leases",
    element: session ? <Leases /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/leases/create",
    element: session ? <CreateLease /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/leases/:id",
    element: session ? <LeaseDetails /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/maintenance",
    element: session ? <Maintenance /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/financials",
    element: session ? <Financials /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/ai-analytics",
    element: session ? <AIAnalytics /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/contractors",
    element: session ? <ManageContractors /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/contractors/:id",
    element: session ? <ContractorDashboard /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/tenants",
    element: session ? <ManageTenants /> : <Navigate to="/auth" replace />,
  },
  {
    path: "/tenants/:id/dashboard",
    element: session ? <TenantDashboard /> : <Navigate to="/auth" replace />,
  },
];
