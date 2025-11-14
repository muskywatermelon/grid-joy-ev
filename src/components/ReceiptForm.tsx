import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Receipt } from "@/hooks/useReceipts";
import { useCompanies } from "@/hooks/useCompanies";
import { receiptSchema, ReceiptFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReceiptFormProps {
  receipt?: Receipt | null;
  onSubmit: (data: Omit<Receipt, "created_at">) => void;
  onCancel: () => void;
}

export const ReceiptForm = ({ receipt, onSubmit, onCancel }: ReceiptFormProps) => {
  const { companies } = useCompanies();
  const [submitError, setSubmitError] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      receipt_number: receipt?.receipt_number || "",
      company_id: receipt?.company_id || 0,
      amount: receipt?.amount || 0,
      date: receipt?.date || "",
      time: receipt?.time || "",
    },
  });

  const companyId = watch("company_id");

  useEffect(() => {
    if (receipt) {
      reset({
        receipt_number: receipt.receipt_number,
        company_id: receipt.company_id,
        amount: receipt.amount,
        date: receipt.date,
        time: receipt.time,
      });
    }
  }, [receipt, reset]);

  const onSubmitForm = (data: ReceiptFormData) => {
    try {
      setSubmitError("");
      const formData = {
        receipt_number: data.receipt_number,
        company_id: data.company_id,
        amount: data.amount,
        date: data.date,
        time: data.time,
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
        <Label htmlFor="receipt_number">Receipt Number</Label>
        <Input id="receipt_number" {...register("receipt_number")} disabled={!!receipt} />
        {errors.receipt_number && (
          <p className="text-sm text-destructive mt-1">{errors.receipt_number.message}</p>
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
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" type="number" step="0.01" {...register("amount")} />
        {errors.amount && (
          <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" {...register("date")} />
        {errors.date && (
          <p className="text-sm text-destructive mt-1">{errors.date.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="time">Time</Label>
        <Input id="time" type="time" {...register("time")} />
        {errors.time && (
          <p className="text-sm text-destructive mt-1">{errors.time.message}</p>
        )}
      </div>
      
      <div className="modal-footer">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{receipt ? "Update" : "Add"}</Button>
      </div>
    </form>
  );
};
