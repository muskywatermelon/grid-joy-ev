import { useState, useEffect } from "react";
import { Company } from "@/hooks/useCompanies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyFormProps {
  company?: Company | null;
  onSubmit: (data: Omit<Company, "id" | "created_at"> & { id?: number }) => void;
  onCancel: () => void;
}

export const CompanyForm = ({ company, onSubmit, onCancel }: CompanyFormProps) => {
  const [formData, setFormData] = useState({
    company_name: "",
    branch: "",
  });

  useEffect(() => {
    if (company) {
      setFormData({
        company_name: company.company_name,
        branch: company.branch,
      });
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company) {
      onSubmit({ ...formData, id: company.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="company_name">Company Name</Label>
        <Input
          id="company_name"
          value={formData.company_name}
          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="branch">Branch</Label>
        <Input
          id="branch"
          value={formData.branch}
          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
          required
        />
      </div>
      <div className="modal-footer">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{company ? "Update" : "Add"}</Button>
      </div>
    </form>
  );
};