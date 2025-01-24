import React from 'react';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { Building, ClipboardList, Home, Settings, Wrench, Search, Bell } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Building, label: "Properties", path: "/properties" },
    { icon: ClipboardList, label: "Leases", path: "/leases" },
    { icon: Wrench, label: "Maintenance", path: "/maintenance" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <div className="relative z-10">
        <Sidebar collapsible="icon" className="group w-12 hover:w-64 transition-all duration-300">
          <SidebarContent>
            <div className="h-16 flex items-center gap-2 px-4 border-b border-gray-200">
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
        <div className="absolute top-0 right-0 h-full border-r border-gray-200 pointer-events-none transition-transform duration-300 group-hover:translate-x-[16rem] w-[3rem] bg-white -translate-x-12" />
      </div>
      <main className="flex-1 overflow-auto relative bg-background">
        <div className="flex items-center justify-between px-8 py-4 shadow-md rounded-[20px] relative z-10 bg-white mx-4 mt-4">
          <div className="flex items-center gap-4">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 w-64 bg-gray-50 border-gray-200"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5 text-gray-600" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
          </div>
        </div>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};