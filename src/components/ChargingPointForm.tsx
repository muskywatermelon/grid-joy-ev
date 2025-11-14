import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChargingPoint } from "@/hooks/useChargingPoints";
import { useCompanies } from "@/hooks/useCompanies";
import { chargingPointSchema, ChargingPointFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChargingPointFormProps {
  chargingPoint?: ChargingPoint | null;
  onSubmit: (data: Omit<ChargingPoint, "created_at"> & { id?: number }) => void;
  onCancel: () => void;
}

export const ChargingPointForm = ({ chargingPoint, onSubmit, onCancel }: ChargingPointFormProps) => {
  const { companies } = useCompanies();
  const [submitError, setSubmitError] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ChargingPointFormData>({
    resolver: zodResolver(chargingPointSchema),
    defaultValues: {
      company_id: chargingPoint?.company_id || 0,
      location: chargingPoint?.location || "",
      num_of_points: chargingPoint?.num_of_points || 0,
      availability: chargingPoint?.availability || "Available",
      functionality: chargingPoint?.functionality || "",
      max_voltage: chargingPoint?.max_voltage || 0,
    },
  });

  const companyId = watch("company_id");
  const availability = watch("availability");

  useEffect(() => {
    if (chargingPoint) {
      reset({
        company_id: chargingPoint.company_id,
        location: chargingPoint.location,
        num_of_points: chargingPoint.num_of_points,
        availability: chargingPoint.availability,
        functionality: chargingPoint.functionality,
        max_voltage: chargingPoint.max_voltage,
      });
    }
  }, [chargingPoint, reset]);

  const onSubmitForm = (data: ChargingPointFormData) => {
    try {
      setSubmitError("");
      const formData = {
        company_id: data.company_id,
        location: data.location,
        num_of_points: data.num_of_points,
        availability: data.availability,
        functionality: data.functionality,
        max_voltage: data.max_voltage,
      };
      
      if (chargingPoint?.id) {
        onSubmit({ ...formData, id: chargingPoint.id });
      } else {
        onSubmit(formData);
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
        <Label htmlFor="location">Location</Label>
        <Input id="location" {...register("location")} />
        {errors.location && (
          <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="num_of_points">Number of Points</Label>
        <Input id="num_of_points" type="number" {...register("num_of_points")} />
        {errors.num_of_points && (
          <p className="text-sm text-destructive mt-1">{errors.num_of_points.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="availability">Availability</Label>
        <Select
          value={availability}
          onValueChange={(value) => setValue("availability", value as "Available" | "Occupied" | "Maintenance")}
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
        {errors.availability && (
          <p className="text-sm text-destructive mt-1">{errors.availability.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="functionality">Functionality</Label>
        <Input id="functionality" {...register("functionality")} />
        {errors.functionality && (
          <p className="text-sm text-destructive mt-1">{errors.functionality.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="max_voltage">Max Voltage</Label>
        <Input id="max_voltage" type="number" step="0.01" {...register("max_voltage")} />
        {errors.max_voltage && (
          <p className="text-sm text-destructive mt-1">{errors.max_voltage.message}</p>
        )}
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
