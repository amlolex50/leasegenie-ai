import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OwnerFormFields } from "@/components/owners/forms/OwnerFormFields";
import { ArrowLeft } from "lucide-react";

const CreateOwner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    maintenance_auth_limit: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user role:', userError);
          return;
        }

        setCurrentUser({ ...user, role: userData?.role });
      }
    };

    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!currentUser) {
        throw new Error('You must be logged in to create an owner');
      }

      if (!['LANDLORD', 'PROPERTY_MANAGER'].includes(currentUser.role)) {
        throw new Error(`Unauthorized role: ${currentUser.role}. Must be LANDLORD or PROPERTY_MANAGER`);
      }

      // Create user with OWNER role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone || null,
            role: 'OWNER',
            landlord_id: currentUser.id
          }
        ])
        .select()
        .single();

      if (userError) {
        console.error('Detailed error:', userError);
        throw userError;
      }

      toast({
        title: "Success",
        description: "Owner has been created successfully.",
      });

      navigate("/owners");
    } catch (error: any) {
      console.error("Error creating owner:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/owners")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Owners
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Create Owner</h1>
          <p className="text-gray-500">Add a new property owner to the system</p>
        </div>

        <div className="max-w-2xl bg-white rounded-lg shadow p-6">
          {currentUser?.role && !['LANDLORD', 'PROPERTY_MANAGER'].includes(currentUser.role) && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              Warning: You don't have the required role (LANDLORD or PROPERTY_MANAGER) to create owners.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <OwnerFormFields formData={formData} setFormData={setFormData} />
            
            <div className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/owners")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !currentUser?.role || !['LANDLORD', 'PROPERTY_MANAGER'].includes(currentUser?.role)}
              >
                {isSubmitting ? "Creating..." : "Create Owner"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateOwner;