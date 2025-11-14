import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer } from "@/hooks/useCustomers";
import { customerSchema, CustomerFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (data: Omit<Customer, "id" | "created_at"> & { id?: number }) => void;
  onCancel: () => void;
}

export const CustomerForm = ({ customer, onSubmit, onCancel }: CustomerFormProps) => {
  const [submitError, setSubmitError] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || "",
      phone_no: customer?.phone_no || "",
      address: customer?.address || "",
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        phone_no: customer.phone_no,
        address: customer.address,
      });
    }
  }, [customer, reset]);

  const onSubmitForm = (data: CustomerFormData) => {
    try {
      setSubmitError("");
      if (customer) {
        onSubmit({ name: data.name, phone_no: data.phone_no, address: data.address, id: customer.id });
      } else {
        onSubmit({ name: data.name, phone_no: data.phone_no, address: data.address });
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
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="phone_no">Phone Number</Label>
        <Input id="phone_no" {...register("phone_no")} />
        {errors.phone_no && (
          <p className="text-sm text-destructive mt-1">{errors.phone_no.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register("address")} />
        {errors.address && (
          <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
        )}
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
