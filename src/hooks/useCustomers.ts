import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Customer {
  id: number;
  name: string;
  phone_no: string;
  address: string;
  created_at?: string;
}

export const useCustomers = () => {
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("id", { ascending: true });
      
      if (error) throw error;
      return data as Customer[];
    },
  });

  const addCustomer = useMutation({
    mutationFn: async (customer: Omit<Customer, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("customers")
        .insert([customer])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      console.error("Failed to add customer:", error);
    },
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Customer> & { id: number }) => {
      const { data, error } = await supabase
        .from("customers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      console.error("Failed to update customer:", error);
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      console.error("Failed to delete customer:", error);
    },
  });

  return {
    customers,
    isLoading,
    addCustomer: addCustomer.mutate,
    updateCustomer: updateCustomer.mutate,
    deleteCustomer: deleteCustomer.mutate,
  };
};