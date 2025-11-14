import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ChargingPoint {
  id?: number;
  company_id: number;
  location: string;
  num_of_points: number;
  availability: "Available" | "Occupied" | "Maintenance";
  functionality: string;
  max_voltage: number;
  created_at?: string;
}

export const useChargingPoints = () => {
  const queryClient = useQueryClient();

  const { data: chargingPoints = [], isLoading } = useQuery({
    queryKey: ["charging_points"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("charging_points")
        .select("*")
        .order("id", { ascending: true });
      
      if (error) throw error;
      return data as ChargingPoint[];
    },
  });

  const addChargingPoint = useMutation({
    mutationFn: async (point: Omit<ChargingPoint, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("charging_points")
        .insert([point])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charging_points"] });
    },
    onError: (error) => {
      console.error("Failed to add charging point:", error);
    },
  });

  const updateChargingPoint = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ChargingPoint> & { id: number }) => {
      const { data, error } = await supabase
        .from("charging_points")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charging_points"] });
    },
    onError: (error) => {
      console.error("Failed to update charging point:", error);
    },
  });

  const deleteChargingPoint = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("charging_points")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charging_points"] });
    },
    onError: (error) => {
      console.error("Failed to delete charging point:", error);
    },
  });

  return {
    chargingPoints,
    isLoading,
    addChargingPoint: addChargingPoint.mutate,
    updateChargingPoint: updateChargingPoint.mutate,
    deleteChargingPoint: deleteChargingPoint.mutate,
  };
};