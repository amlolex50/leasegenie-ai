import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Wrench, 
  BrainCircuit,
  Users,
  Hammer
} from "lucide-react";

export const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Properties",
    path: "/properties",
    icon: Building2,
  },
  {
    label: "Leases",
    path: "/leases",
    icon: FileText,
  },
  {
    label: "Tenants",
    path: "/tenants",
    icon: Users,
  },
  {
    label: "Contractors",
    path: "/contractors",
    icon: Hammer,
  },
  {
    label: "Maintenance",
    path: "/maintenance",
    icon: Wrench,
  },
  {
    label: "AI Analytics",
    path: "/ai-analytics",
    icon: BrainCircuit,
  },
];