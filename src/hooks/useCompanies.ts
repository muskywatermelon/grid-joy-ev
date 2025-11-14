import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Company {
  id: number;
  company_name: string;
  branch: string;
  created_at?: string;
}

export const useCompanies = () => {
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("id", { ascending: true });
      
      if (error) throw error;
      return data as Company[];
    },
  });

  const addCompany = useMutation({
    mutationFn: async (company: Omit<Company, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("companies")
        .insert([company])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error) => {
      console.error("Failed to add company:", error);
    },
  });

  const updateCompany = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Company> & { id: number }) => {
      const { data, error } = await supabase
        .from("companies")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error) => {
      console.error("Failed to update company:", error);
    },
  });

  const deleteCompany = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error) => {
      console.error("Failed to delete company:", error);
    },
  });

  return {
    companies,
    isLoading,
    addCompany: addCompany.mutate,
    updateCompany: updateCompany.mutate,
    deleteCompany: deleteCompany.mutate,
  };
};