import { Input } from "@/components/ui/input";

interface OwnerFormData {
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  maintenance_auth_limit: string;
}

interface OwnerFormFieldsProps {
  formData: OwnerFormData;
  setFormData: (data: OwnerFormData) => void;
}

export const OwnerFormFields = ({ formData, setFormData }: OwnerFormFieldsProps) => {
  return (
    <>
      <div>
        <Input
          type="text"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Input
          type="tel"
          placeholder="Phone (optional)"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder="Company Name (optional)"
          value={formData.company_name}
          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
        />
      </div>
      <div>
        <Input
          type="number"
          placeholder="Maintenance Authorization Limit (optional)"
          value={formData.maintenance_auth_limit}
          onChange={(e) => setFormData({ ...formData, maintenance_auth_limit: e.target.value })}
        />
      </div>
    </>
  );
};