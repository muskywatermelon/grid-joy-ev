import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@/hooks/useCompanies";
import { companySchema, CompanyFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CompanyFormProps {
  company?: Company | null;
  onSubmit: (data: Omit<Company, "id" | "created_at"> & { id?: number }) => void;
  onCancel: () => void;
}

export const CompanyForm = ({ company, onSubmit, onCancel }: CompanyFormProps) => {
  const [submitError, setSubmitError] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company_name: company?.company_name || "",
      branch: company?.branch || "",
    },
  });

  useEffect(() => {
    if (company) {
      reset({
        company_name: company.company_name,
        branch: company.branch,
      });
    }
  }, [company, reset]);

  const onSubmitForm = (data: CompanyFormData) => {
    try {
      setSubmitError("");
      if (company) {
        onSubmit({ company_name: data.company_name, branch: data.branch, id: company.id });
      } else {
        onSubmit({ company_name: data.company_name, branch: data.branch });
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit form");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <Label htmlFor="company_name">Company Name</Label>
        <Input id="company_name" {...register("company_name")} />
        {errors.company_name && (
          <p className="text-sm text-destructive mt-1">{errors.company_name.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="branch">Branch</Label>
        <Input id="branch" {...register("branch")} />
        {errors.branch && (
          <p className="text-sm text-destructive mt-1">{errors.branch.message}</p>
        )}
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