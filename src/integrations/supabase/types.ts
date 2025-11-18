export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          changed_at: string | null
          id: number
          new_data: Json | null
          old_data: Json | null
          operation: string
          record_id: string
          table_name: string
        }
        Insert: {
          changed_at?: string | null
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          record_id: string
          table_name: string
        }
        Update: {
          changed_at?: string | null
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      charging_points: {
        Row: {
          availability: string
          company_id: number | null
          created_at: string | null
          functionality: string
          id: number
          location: string
          max_voltage: number
          num_of_points: number
          updated_at: string | null
        }
        Insert: {
          availability: string
          company_id?: number | null
          created_at?: string | null
          functionality: string
          id?: number
          location: string
          max_voltage: number
          num_of_points: number
          updated_at?: string | null
        }
        Update: {
          availability?: string
          company_id?: number | null
          created_at?: string | null
          functionality?: string
          id?: number
          location?: string
          max_voltage?: number
          num_of_points?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "charging_points_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charging_points_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          branch: string
          company_name: string
          created_at: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          branch: string
          company_name: string
          created_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          branch?: string
          company_name?: string
          created_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string
          created_at: string | null
          id: number
          name: string
          phone_no: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: number
          name: string
          phone_no: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: number
          name?: string
          phone_no?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ev_info: {
        Row: {
          battery_time: string
          company_id: number | null
          cost: number
          created_at: string | null
          model: string
          num_plate: string
          specs: string
          updated_at: string | null
          volt_req: number
        }
        Insert: {
          battery_time: string
          company_id?: number | null
          cost: number
          created_at?: string | null
          model: string
          num_plate: string
          specs: string
          updated_at?: string | null
          volt_req: number
        }
        Update: {
          battery_time?: string
          company_id?: number | null
          cost?: number
          created_at?: string | null
          model?: string
          num_plate?: string
          specs?: string
          updated_at?: string | null
          volt_req?: number
        }
        Relationships: [
          {
            foreignKeyName: "ev_info_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ev_info_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      receipts: {
        Row: {
          amount: number
          company_id: number | null
          created_at: string | null
          date: string
          receipt_number: string
          time: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          company_id?: number | null
          created_at?: string | null
          date: string
          receipt_number: string
          time: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          company_id?: number | null
          created_at?: string | null
          date?: string
          receipt_number?: string
          time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      charging_point_details: {
        Row: {
          availability: string | null
          branch: string | null
          company_name: string | null
          created_at: string | null
          functionality: string | null
          id: number | null
          location: string | null
          max_voltage: number | null
          num_of_points: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      charging_point_utilization: {
        Row: {
          available: number | null
          branch: string | null
          company_name: string | null
          maintenance: number | null
          occupied: number | null
          total_points: number | null
          utilization_percentage: number | null
        }
        Relationships: []
      }
      company_summary: {
        Row: {
          available_points: number | null
          branch: string | null
          company_name: string | null
          id: number | null
          maintenance_points: number | null
          occupied_points: number | null
          total_charging_points: number | null
          total_receipts: number | null
          total_revenue: number | null
          total_vehicles: number | null
        }
        Relationships: []
      }
      daily_revenue_summary: {
        Row: {
          average_transaction: number | null
          date: string | null
          max_transaction: number | null
          min_transaction: number | null
          total_revenue: number | null
          transaction_count: number | null
        }
        Relationships: []
      }
      ev_details: {
        Row: {
          battery_time: string | null
          branch: string | null
          company_name: string | null
          cost: number | null
          created_at: string | null
          model: string | null
          num_plate: string | null
          specs: string | null
          updated_at: string | null
          volt_req: number | null
        }
        Relationships: []
      }
      receipt_details: {
        Row: {
          amount: number | null
          branch: string | null
          company_name: string | null
          created_at: string | null
          date: string | null
          receipt_number: string | null
          time: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
