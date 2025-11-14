import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EVInfo } from "@/hooks/useEVInfo";
import { useCompanies } from "@/hooks/useCompanies";
import { evInfoSchema, EVInfoFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EVFormProps {
  ev?: EVInfo | null;
  onSubmit: (data: Omit<EVInfo, "created_at">) => void;
  onCancel: () => void;
}

export const EVForm = ({ ev, onSubmit, onCancel }: EVFormProps) => {
  const { companies } = useCompanies();
  const [submitError, setSubmitError] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EVInfoFormData>({
    resolver: zodResolver(evInfoSchema),
    defaultValues: {
      num_plate: ev?.num_plate || "",
      specs: ev?.specs || "",
      model: ev?.model || "",
      battery_time: ev?.battery_time || "",
      volt_req: ev?.volt_req || 0,
      cost: ev?.cost || 0,
      company_id: ev?.company_id || 0,
    },
  });

  const companyId = watch("company_id");

  useEffect(() => {
    if (ev) {
      reset({
        num_plate: ev.num_plate,
        specs: ev.specs,
        model: ev.model,
        battery_time: ev.battery_time,
        volt_req: ev.volt_req,
        cost: ev.cost,
        company_id: ev.company_id,
      });
    }
  }, [ev, reset]);

  const onSubmitForm = (data: EVInfoFormData) => {
    try {
      setSubmitError("");
      const formData = {
        num_plate: data.num_plate,
        specs: data.specs,
        model: data.model,
        battery_time: data.battery_time,
        volt_req: data.volt_req,
        cost: data.cost,
        company_id: data.company_id,
      };
      onSubmit(formData);
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
        <Label htmlFor="num_plate">Number Plate</Label>
        <Input id="num_plate" {...register("num_plate")} disabled={!!ev} />
        {errors.num_plate && (
          <p className="text-sm text-destructive mt-1">{errors.num_plate.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="company_id">Company</Label>
        <Select
          value={companyId?.toString()}
          onValueChange={(value) => setValue("company_id", parseInt(value))}
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
        {errors.company_id && (
          <p className="text-sm text-destructive mt-1">{errors.company_id.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="specs">Specs</Label>
        <Input id="specs" {...register("specs")} />
        {errors.specs && (
          <p className="text-sm text-destructive mt-1">{errors.specs.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="model">Model</Label>
        <Input id="model" {...register("model")} />
        {errors.model && (
          <p className="text-sm text-destructive mt-1">{errors.model.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="battery_time">Battery Time</Label>
        <Input id="battery_time" {...register("battery_time")} />
        {errors.battery_time && (
          <p className="text-sm text-destructive mt-1">{errors.battery_time.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="volt_req">Voltage Required</Label>
        <Input id="volt_req" type="number" step="0.01" {...register("volt_req")} />
        {errors.volt_req && (
          <p className="text-sm text-destructive mt-1">{errors.volt_req.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="cost">Cost</Label>
        <Input id="cost" type="number" step="0.01" {...register("cost")} />
        {errors.cost && (
          <p className="text-sm text-destructive mt-1">{errors.cost.message}</p>
        )}
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
