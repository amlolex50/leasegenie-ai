import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Wrench, 
  HelpCircle, 
  BrainCircuit,
  Settings,
  User
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Fetch user and profile data
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from('users')
          .select('full_name')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUserName(data.full_name);
            }
          });
      }
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsible="icon" className="group w-[17px] hover:w-[254px] transition-all duration-300">
        <SidebarContent>
          <div className="h-16 flex items-center gap-2 px-4">
            <span className="text-blue-600 text-2xl">★</span>
            <span className="font-semibold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              ManageLeaseAi
            </span>
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
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.label}
                      </span>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <User className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};