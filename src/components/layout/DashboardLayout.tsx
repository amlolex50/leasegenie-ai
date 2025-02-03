import { Sidebar } from "@/components/ui/sidebar";
import { SidebarContent } from "./dashboard/SidebarContent";
import { TopNavigation } from "./dashboard/TopNavigation";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <Sidebar collapsible="icon" className="group w-[55px] hover:w-[245px] transition-all duration-300">
        <SidebarContent />
      </Sidebar>
      <main className="flex-1 relative bg-background overflow-y-auto">
        <TopNavigation />
        <div className="py-4 max-w-[100vw]">{children}</div>
      </main>
    </div>
  );
};