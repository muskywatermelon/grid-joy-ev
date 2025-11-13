import { useState, useEffect } from "react";
import { Customer } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (data: Omit<Customer, "id" | "created_at"> & { id?: number }) => void;
  onCancel: () => void;
}

export const CustomerForm = ({ customer, onSubmit, onCancel }: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_no: "",
    address: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone_no: customer.phone_no,
        address: customer.address,
      });
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer) {
      onSubmit({ ...formData, id: customer.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone_no">Phone Number</Label>
        <Input
          id="phone_no"
          value={formData.phone_no}
          onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>
      <div className="modal-footer">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{customer ? "Update" : "Add"}</Button>
      </div>
    </form>
  );
};