import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Receipt {
  receipt_number: string;
  company_id: number;
  amount: number;
  date: string;
  time: string;
  created_at?: string;
}

export const useReceipts = () => {
  const queryClient = useQueryClient();

  const { data: receipts = [], isLoading } = useQuery({
    queryKey: ["receipts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as Receipt[];
    },
  });

  const addReceipt = useMutation({
    mutationFn: async (receipt: Omit<Receipt, "created_at">) => {
      const { data, error } = await supabase
        .from("receipts")
        .insert([receipt])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Receipt added successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to add receipt: ${error.message}`);
    },
  });

  const updateReceipt = useMutation({
    mutationFn: async ({ receipt_number, ...updates }: Partial<Receipt> & { receipt_number: string }) => {
      const { data, error } = await supabase
        .from("receipts")
        .update(updates)
        .eq("receipt_number", receipt_number)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Receipt updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update receipt: ${error.message}`);
    },
  });

  const deleteReceipt = useMutation({
    mutationFn: async (receipt_number: string) => {
      const { error } = await supabase
        .from("receipts")
        .delete()
        .eq("receipt_number", receipt_number);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Receipt deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to delete receipt: ${error.message}`);
    },
  });

  return {
    receipts,
    isLoading,
    addReceipt: addReceipt.mutate,
    updateReceipt: updateReceipt.mutate,
    deleteReceipt: deleteReceipt.mutate,
  };
};