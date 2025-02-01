import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Wrench, 
  HelpCircle, 
  BrainCircuit,
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
    label: "Maintenance",
    path: "/maintenance",
    icon: Wrench,
  },
  {
    label: "AI Analytics",
    path: "/ai-analytics",
    icon: BrainCircuit,
  },
  {
    label: "How it Works",
    path: "/how-it-works",
    icon: HelpCircle,
  },
];