import { 
  SidebarContent as BaseSidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { menuItems } from "./menuItems";

export const SidebarContent = () => {
  const navigate = useNavigate();

  return (
    <BaseSidebarContent>
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
    </BaseSidebarContent>
  );
};