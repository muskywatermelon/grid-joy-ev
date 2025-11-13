import { useState, useEffect } from "react";
import { EVInfo } from "@/hooks/useEVInfo";
import { useCompanies } from "@/hooks/useCompanies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EVFormProps {
  ev?: EVInfo | null;
  onSubmit: (data: Omit<EVInfo, "created_at">) => void;
  onCancel: () => void;
}

export const EVForm = ({ ev, onSubmit, onCancel }: EVFormProps) => {
  const { companies } = useCompanies();
  const [formData, setFormData] = useState({
    num_plate: "",
    company_id: 0,
    specs: "",
    model: "",
    battery_time: "",
    volt_req: 0,
    cost: 0,
  });

  useEffect(() => {
    if (ev) {
      setFormData({
        num_plate: ev.num_plate,
        company_id: ev.company_id,
        specs: ev.specs,
        model: ev.model,
        battery_time: ev.battery_time,
        volt_req: ev.volt_req,
        cost: ev.cost,
      });
    }
  }, [ev]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="num_plate">Number Plate</Label>
        <Input
          id="num_plate"
          value={formData.num_plate}
          onChange={(e) => setFormData({ ...formData, num_plate: e.target.value })}
          disabled={!!ev}
          required
        />
      </div>
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
        <Label htmlFor="specs">Specs</Label>
        <Input
          id="specs"
          value={formData.specs}
          onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="battery_time">Battery Time</Label>
        <Input
          id="battery_time"
          value={formData.battery_time}
          onChange={(e) => setFormData({ ...formData, battery_time: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="volt_req">Voltage Required</Label>
        <Input
          id="volt_req"
          type="number"
          step="0.01"
          value={formData.volt_req}
          onChange={(e) => setFormData({ ...formData, volt_req: parseFloat(e.target.value) })}
          required
        />
      </div>
      <div>
        <Label htmlFor="cost">Cost</Label>
        <Input
          id="cost"
          type="number"
          step="0.01"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
          required
        />
      </div>
      <div className="modal-footer">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{ev ? "Update" : "Add"}</Button>
      </div>
    </form>
  );
};