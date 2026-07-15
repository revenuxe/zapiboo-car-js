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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      condition_groups: {
        Row: {
          active: boolean
          category_id: string
          created_at: string
          id: string
          key: string
          selection: string
          step_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          category_id: string
          created_at?: string
          id?: string
          key: string
          selection?: string
          step_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          category_id?: string
          created_at?: string
          id?: string
          key?: string
          selection?: string
          step_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "condition_groups_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "device_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      condition_options: {
        Row: {
          created_at: string
          description: string | null
          group_id: string
          id: string
          kind: string
          label: string
          sort_order: number
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_id: string
          id?: string
          kind?: string
          label: string
          sort_order?: number
          updated_at?: string
          value?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          group_id?: string
          id?: string
          kind?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "condition_options_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "condition_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      device_brands: {
        Row: {
          active: boolean
          category_id: string
          created_at: string
          id: string
          logo: string | null
          name: string
          platform: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category_id: string
          created_at?: string
          id?: string
          logo?: string | null
          name: string
          platform?: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category_id?: string
          created_at?: string
          id?: string
          logo?: string | null
          name?: string
          platform?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_brands_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "device_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      device_categories: {
        Row: {
          active: boolean
          created_at: string
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      device_models: {
        Row: {
          active: boolean
          base_price: number
          created_at: string
          id: string
          image: string | null
          name: string
          series_id: string
          slug: string
          sort_order: number
          updated_at: string
          year: number | null
        }
        Insert: {
          active?: boolean
          base_price?: number
          created_at?: string
          id?: string
          image?: string | null
          name: string
          series_id: string
          slug: string
          sort_order?: number
          updated_at?: string
          year?: number | null
        }
        Update: {
          active?: boolean
          base_price?: number
          created_at?: string
          id?: string
          image?: string | null
          name?: string
          series_id?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "device_models_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "device_series"
            referencedColumns: ["id"]
          },
        ]
      }
      device_orders: {
        Row: {
          address: string | null
          base_price: number
          brand_name: string | null
          category_id: string | null
          category_name: string | null
          created_at: string
          email: string | null
          final_price: number
          id: string
          model_id: string | null
          model_name: string | null
          name: string
          notes: string | null
          phone: string
          pincode: string | null
          preferred_date: string | null
          selections: Json
          series_name: string | null
          slot: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          base_price?: number
          brand_name?: string | null
          category_id?: string | null
          category_name?: string | null
          created_at?: string
          email?: string | null
          final_price?: number
          id?: string
          model_id?: string | null
          model_name?: string | null
          name: string
          notes?: string | null
          phone: string
          pincode?: string | null
          preferred_date?: string | null
          selections?: Json
          series_name?: string | null
          slot?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          base_price?: number
          brand_name?: string | null
          category_id?: string | null
          category_name?: string | null
          created_at?: string
          email?: string | null
          final_price?: number
          id?: string
          model_id?: string | null
          model_name?: string | null
          name?: string
          notes?: string | null
          phone?: string
          pincode?: string | null
          preferred_date?: string | null
          selections?: Json
          series_name?: string | null
          slot?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_orders_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "device_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_orders_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "device_models"
            referencedColumns: ["id"]
          },
        ]
      }
      device_series: {
        Row: {
          active: boolean
          brand_id: string
          created_at: string
          id: string
          image: string | null
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          brand_id: string
          created_at?: string
          id?: string
          image?: string | null
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          brand_id?: string
          created_at?: string
          id?: string
          image?: string | null
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_series_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "device_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          has_photo: boolean
          id: string
          items: string[]
          landmark: string | null
          lat: number | null
          lead_type: string
          lng: number | null
          locality: string | null
          name: string
          notes: string | null
          phone: string
          photo_url: string | null
          pincode: string | null
          preferred_date: string | null
          scrap_mode: string
          size_tier: string | null
          slot: string | null
          status: string
          subject: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          has_photo?: boolean
          id?: string
          items?: string[]
          landmark?: string | null
          lat?: number | null
          lead_type?: string
          lng?: number | null
          locality?: string | null
          name: string
          notes?: string | null
          phone: string
          photo_url?: string | null
          pincode?: string | null
          preferred_date?: string | null
          scrap_mode?: string
          size_tier?: string | null
          slot?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          has_photo?: boolean
          id?: string
          items?: string[]
          landmark?: string | null
          lat?: number | null
          lead_type?: string
          lng?: number | null
          locality?: string | null
          name?: string
          notes?: string | null
          phone?: string
          photo_url?: string | null
          pincode?: string | null
          preferred_date?: string | null
          scrap_mode?: string
          size_tier?: string | null
          slot?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      scrap_categories: {
        Row: {
          active: boolean
          created_at: string
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      scrap_listings: {
        Row: {
          active: boolean
          category_id: string | null
          condition: string
          created_at: string
          description: string | null
          featured: boolean
          id: string
          images: string[]
          location: string | null
          price: string | null
          quantity: string | null
          slug: string
          sort_order: number
          subcategory: string | null
          title: string
          unit: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          category_id?: string | null
          condition?: string
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          images?: string[]
          location?: string | null
          price?: string | null
          quantity?: string | null
          slug: string
          sort_order?: number
          subcategory?: string | null
          title: string
          unit?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          category_id?: string | null
          condition?: string
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          images?: string[]
          location?: string | null
          price?: string | null
          quantity?: string | null
          slug?: string
          sort_order?: number
          subcategory?: string | null
          title?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scrap_listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "scrap_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      scrap_rates: {
        Row: {
          active: boolean
          category_id: string | null
          created_at: string
          id: string
          name: string
          note: string | null
          price: string
          sort_order: number
          unit: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          category_id?: string | null
          created_at?: string
          id?: string
          name: string
          note?: string | null
          price: string
          sort_order?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          category_id?: string | null
          created_at?: string
          id?: string
          name?: string
          note?: string | null
          price?: string
          sort_order?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scrap_rates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "scrap_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_locations: {
        Row: {
          active: boolean
          area: string | null
          created_at: string
          id: string
          location_type: string
          pincode: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          area?: string | null
          created_at?: string
          id?: string
          location_type: string
          pincode?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          area?: string | null
          created_at?: string
          id?: string
          location_type?: string
          pincode?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      spec_groups: {
        Row: {
          active: boolean
          category_id: string
          created_at: string
          depends_family: string | null
          id: string
          key: string
          platform: string | null
          selection: string
          step_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          category_id: string
          created_at?: string
          depends_family?: string | null
          id?: string
          key: string
          platform?: string | null
          selection?: string
          step_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          category_id?: string
          created_at?: string
          depends_family?: string | null
          id?: string
          key?: string
          platform?: string | null
          selection?: string
          step_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spec_groups_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "device_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      spec_options: {
        Row: {
          created_at: string
          description: string | null
          family: string | null
          group_id: string
          id: string
          kind: string
          label: string
          sort_order: number
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          family?: string | null
          group_id: string
          id?: string
          kind?: string
          label: string
          sort_order?: number
          updated_at?: string
          value?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          family?: string | null
          group_id?: string
          id?: string
          kind?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "spec_options_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "spec_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          created_at: string
          full_name: string | null
          lat: number | null
          lng: number | null
          pincode: string | null
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          lat?: number | null
          lng?: number | null
          pincode?: string | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          lat?: number | null
          lng?: number | null
          pincode?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: { Args: never; Returns: boolean }
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      resolve_device_path: {
        Args: {
          _brand: string
          _category: string
          _model: string
          _series: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
