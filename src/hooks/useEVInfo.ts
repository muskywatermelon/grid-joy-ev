import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EVInfo {
  num_plate: string;
  company_id: number;
  specs: string;
  model: string;
  battery_time: string;
  volt_req: number;
  cost: number;
  created_at?: string;
}

export const useEVInfo = () => {
  const queryClient = useQueryClient();

  const { data: evInfo = [], isLoading } = useQuery({
    queryKey: ["ev_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ev_info")
        .select("*")
        .order("num_plate", { ascending: true });
      
      if (error) throw error;
      return data as EVInfo[];
    },
  });

  const addEVInfo = useMutation({
    mutationFn: async (ev: Omit<EVInfo, "created_at">) => {
      const { data, error } = await supabase
        .from("ev_info")
        .insert([ev])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ev_info"] });
      toast.success("EV information added successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to add EV: ${error.message}`);
    },
  });

  const updateEVInfo = useMutation({
    mutationFn: async ({ num_plate, ...updates }: Partial<EVInfo> & { num_plate: string }) => {
      const { data, error } = await supabase
        .from("ev_info")
        .update(updates)
        .eq("num_plate", num_plate)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ev_info"] });
      toast.success("EV information updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update EV: ${error.message}`);
    },
  });

  const deleteEVInfo = useMutation({
    mutationFn: async (num_plate: string) => {
      const { error } = await supabase
        .from("ev_info")
        .delete()
        .eq("num_plate", num_plate);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ev_info"] });
      toast.success("EV information deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to delete EV: ${error.message}`);
    },
  });

  return {
    evInfo,
    isLoading,
    addEVInfo: addEVInfo.mutate,
    updateEVInfo: updateEVInfo.mutate,
    deleteEVInfo: deleteEVInfo.mutate,
  };
};