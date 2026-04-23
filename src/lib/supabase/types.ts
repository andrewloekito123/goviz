export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  year: string;
  location: string;
  category: string;
  description: string;
  tags: string[];
  pattern_angle: number;
  pattern_color: string;
  bg_color: string;
  cover_url: string | null;
  model_url: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectInsert = Omit<
  ProjectRow,
  "id" | "created_at" | "updated_at"
> & { id?: string };

export type ProjectUpdate = Partial<Omit<ProjectRow, "id" | "created_at">>;

export type ServiceRow = {
  id: string;
  num: string;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ServiceInsert = Omit<
  ServiceRow,
  "id" | "created_at" | "updated_at"
> & { id?: string };

export type ServiceUpdate = Partial<Omit<ServiceRow, "id" | "created_at">>;

export type SiteSettingsRow = {
  id: number;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  studio_name: string;
  studio_tagline: string;
  studio_founded: string;
  studio_city: string;
  studio_country: string;
  updated_at: string;
};

export type SiteSettingsUpdate = Partial<
  Omit<SiteSettingsRow, "id" | "updated_at">
>;

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
        Relationships: [];
      };
      services: {
        Row: ServiceRow;
        Insert: ServiceInsert;
        Update: ServiceUpdate;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingsRow;
        Insert: Partial<SiteSettingsRow> & { id?: number };
        Update: SiteSettingsUpdate;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
