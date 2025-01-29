import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContractorFormFieldsProps {
  formData: {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    speciality: string;
    skills: string;
    hourly_rate: string;
  };
  setFormData: (data: any) => void;
}

export const ContractorFormFields = ({ formData, setFormData }: ContractorFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
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
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="speciality">Speciality</Label>
        <Input
          id="speciality"
          value={formData.speciality}
          onChange={(e) => setFormData(prev => ({ ...prev, speciality: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input
          id="skills"
          value={formData.skills}
          onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
          placeholder="e.g. Plumbing, Electrical, HVAC"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
        <Input
          id="hourly_rate"
          type="number"
          value={formData.hourly_rate}
          onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
        />
      </div>
    </>
  );
};