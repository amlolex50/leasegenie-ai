import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OwnerFormData } from "../types";

interface OwnerFormFieldsProps {
  formData: OwnerFormData;
  setFormData: (data: OwnerFormData) => void;
}

export const OwnerFormFields = ({ formData, setFormData }: OwnerFormFieldsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-4">
      <FormField
        name="full_name"
        render={() => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="email"
        render={() => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="phone"
        render={() => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="company_name"
        render={() => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};