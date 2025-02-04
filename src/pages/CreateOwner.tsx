import { useState } from "react";
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
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    maintenance_auth_limit: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("owners").insert([
        {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || null,
          company_name: formData.company_name || null,
          maintenance_auth_limit: formData.maintenance_auth_limit ? parseFloat(formData.maintenance_auth_limit) : null,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Owner has been created successfully.",
      });

      navigate("/owners");
    } catch (error) {
      console.error("Error creating owner:", error);
      toast({
        title: "Error",
        description: "Failed to create owner. Please try again.",
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
              <Button type="submit" disabled={isSubmitting}>
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