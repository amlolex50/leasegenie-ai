import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LandlordDashboard } from "@/components/dashboard/LandlordDashboard";
import { TenantDashboard } from "@/components/dashboard/TenantDashboard";
import { ContractorDashboard } from "@/components/dashboard/ContractorDashboard";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        console.log("Current user ID:", user.id); // Debug log

        const { data: userData, error } = await supabase
          .from("users")
          .select("role, full_name")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          toast({
            title: "Error",
            description: "Failed to load user role. Please try again or contact support.",
            variant: "destructive",
          });
        } else if (userData) {
          console.log("User data found:", userData); // Debug log
          setUserRole(userData.role);
        } else {
          console.log("No user data found"); // Debug log
          toast({
            title: "Account Setup Required",
            description: "Your user profile is not properly configured. Please contact support.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error in fetchUserRole:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [toast]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {userRole === "LANDLORD" && <LandlordDashboard />}
      {userRole === "TENANT" && <TenantDashboard />}
      {userRole === "CONTRACTOR" && <ContractorDashboard />}
      {userRole === "OWNER" && <OwnerDashboard />}
      {!userRole && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-600">No dashboard available for your role.</p>
          <p className="text-sm text-gray-500 mt-2">Please ensure your account has been properly set up.</p>
          <p className="text-sm text-gray-400 mt-1">Current auth status: {userRole === null ? "No role assigned" : `Role: ${userRole}`}</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Index;