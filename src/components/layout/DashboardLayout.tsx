import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Building, ClipboardList, Home, Settings, Wrench, Search, Bell } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Building, label: "Properties", path: "/properties" },
    { icon: ClipboardList, label: "Leases", path: "/leases" },
    { icon: Wrench, label: "Maintenance", path: "/maintenance" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar className="border-r border-gray-200">
        <SidebarContent>
          <div className="h-16 flex items-center gap-2 px-4 border-b border-gray-200">
            <span className="text-blue-600 text-2xl">★</span>
            <span className="font-semibold text-xl">LeaseGenie</span>
          </div>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton onClick={() => navigate(item.path)}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 overflow-auto">
        <div className="h-16 px-8 border-b border-gray-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-500 text-2xl">★</span>
            <span className="font-semibold text-xl">LeaseGenie AI</span>
            <span className="text-gray-500 ml-2">Dashboard</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Properties</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Leases</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Maintenance</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 w-64 bg-gray-50 border-gray-200 rounded-full"
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