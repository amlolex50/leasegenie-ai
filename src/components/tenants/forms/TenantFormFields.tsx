import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TenantFormData } from "../types";

interface TenantFormFieldsProps {
  formData: TenantFormData;
  setFormData: (data: TenantFormData) => void;
}

export const TenantFormFields = ({ formData, setFormData }: TenantFormFieldsProps) => {
  const nationalities = [
    "British", "French", "German", "Italian", "Spanish", "Other"
  ];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date_of_birth">Date of Birth</Label>
        <Input
          id="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nationality">Nationality</Label>
        <Select 
          value={formData.nationality} 
          onValueChange={(value) => setFormData({ ...formData, nationality: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select nationality" />
          </SelectTrigger>
          <SelectContent>
            {nationalities.map((nationality) => (
              <SelectItem key={nationality} value={nationality.toLowerCase()}>
                {nationality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select 
          value={formData.gender} 
          onValueChange={(value) => setFormData({ ...formData, gender: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};