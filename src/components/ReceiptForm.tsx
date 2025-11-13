import { useState, useEffect } from "react";
import { Receipt } from "@/hooks/useReceipts";
import { useCompanies } from "@/hooks/useCompanies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReceiptFormProps {
  receipt?: Receipt | null;
  onSubmit: (data: Omit<Receipt, "created_at">) => void;
  onCancel: () => void;
}

export const ReceiptForm = ({ receipt, onSubmit, onCancel }: ReceiptFormProps) => {
  const { companies } = useCompanies();
  const [formData, setFormData] = useState({
    receipt_number: "",
    company_id: 0,
    amount: 0,
    date: "",
    time: "",
  });

  useEffect(() => {
    if (receipt) {
      setFormData({
        receipt_number: receipt.receipt_number,
        company_id: receipt.company_id,
        amount: receipt.amount,
        date: receipt.date,
        time: receipt.time,
      });
    }
  }, [receipt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="receipt_number">Receipt Number</Label>
        <Input
          id="receipt_number"
          value={formData.receipt_number}
          onChange={(e) => setFormData({ ...formData, receipt_number: e.target.value })}
          disabled={!!receipt}
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
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
        />
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