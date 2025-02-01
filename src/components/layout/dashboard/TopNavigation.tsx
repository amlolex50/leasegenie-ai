import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { menuItems } from "./menuItems";
import { UserMenu } from "./UserMenu";

export const TopNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-8 py-4 shadow-sm bg-white mx-4 rounded-b-[20px]">
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
      <UserMenu />
    </div>
  );
};