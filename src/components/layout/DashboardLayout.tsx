import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Building2, FileText, HelpCircle } from "lucide-react";

const menuItems = [
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
    label: "How it Works",
    path: "/how-it-works",
    icon: HelpCircle,
  },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsible="icon" className="group w-12 hover:w-64 transition-all duration-300">
        <SidebarContent>
          <div className="h-16 flex items-center gap-2 px-4">
            <span className="text-blue-600 text-2xl">★</span>
            <span className="font-semibold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">LeaseGenie AI</span>
          </div>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton 
                      onClick={() => navigate(item.path)}
                      tooltip={item.label}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 overflow-auto relative bg-background">
        <div className="flex items-center justify-between px-8 py-4 shadow-sm bg-white mx-4 mt-4 rounded-[20px]">
          <div className="flex items-center gap-4">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="hidden md:flex"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};