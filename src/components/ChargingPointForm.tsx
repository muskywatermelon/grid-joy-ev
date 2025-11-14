import { useState, useEffect } from "react";
import { ChargingPoint } from "@/hooks/useChargingPoints";
import { useCompanies } from "@/hooks/useCompanies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChargingPointFormProps {
  chargingPoint?: ChargingPoint | null;
  onSubmit: (data: Omit<ChargingPoint, "created_at"> & { id?: number }) => void;
  onCancel: () => void;
}

export const ChargingPointForm = ({ chargingPoint, onSubmit, onCancel }: ChargingPointFormProps) => {
  const { companies } = useCompanies();
  const [formData, setFormData] = useState({
    company_id: 0,
    location: "",
    num_of_points: 0,
    availability: "Available" as "Available" | "Occupied" | "Maintenance",
    functionality: "",
    max_voltage: 0,
  });

  useEffect(() => {
    if (chargingPoint) {
      setFormData({
        company_id: chargingPoint.company_id,
        location: chargingPoint.location,
        num_of_points: chargingPoint.num_of_points,
        availability: chargingPoint.availability,
        functionality: chargingPoint.functionality,
        max_voltage: chargingPoint.max_voltage,
      });
    }
  }, [chargingPoint]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chargingPoint?.id) {
      onSubmit({ ...formData, id: chargingPoint.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="company_id">Company</Label>
        <Select
          value={formData.company_id.toString()}
          onValueChange={(value) => setFormData({ ...formData, company_id: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id.toString()}>
                {company.company_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="num_of_points">Number of Points</Label>
        <Input
          id="num_of_points"
          type="number"
          value={formData.num_of_points}
          onChange={(e) => setFormData({ ...formData, num_of_points: parseInt(e.target.value) })}
          required
        />
      </div>
      <div>
        <Label htmlFor="availability">Availability</Label>
        <Select
          value={formData.availability}
          onValueChange={(value: "Available" | "Occupied" | "Maintenance") =>
            setFormData({ ...formData, availability: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Occupied">Occupied</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="functionality">Functionality</Label>
        <Input
          id="functionality"
          value={formData.functionality}
          onChange={(e) => setFormData({ ...formData, functionality: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="max_voltage">Max Voltage</Label>
        <Input
          id="max_voltage"
          type="number"
          step="0.01"
          value={formData.max_voltage}
          onChange={(e) => setFormData({ ...formData, max_voltage: parseFloat(e.target.value) })}
          required
        />
      </div>
      <div className="modal-footer">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{chargingPoint ? "Update" : "Add"}</Button>
      </div>
    </form>
  );
};