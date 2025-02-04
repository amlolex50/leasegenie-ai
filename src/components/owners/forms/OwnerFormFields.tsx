import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OwnerFormFieldsProps {
  formData: {
    full_name: string;
    email: string;
    phone: string;
    company_name: string;
    maintenance_auth_limit: string;
  };
  setFormData: (data: any) => void;
}

export const OwnerFormFields = ({ formData, setFormData }: OwnerFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name *</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name</Label>
        <Input
          id="company_name"
          value={formData.company_name}
          onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maintenance_auth_limit">Maintenance Authorization Limit ($)</Label>
        <Input
          id="maintenance_auth_limit"
          type="number"
          value={formData.maintenance_auth_limit}
          onChange={(e) => setFormData(prev => ({ ...prev, maintenance_auth_limit: e.target.value }))}
          placeholder="e.g. 500"
        />
      </div>
    </>
  );
};