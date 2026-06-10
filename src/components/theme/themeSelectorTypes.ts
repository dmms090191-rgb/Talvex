export interface ThemeConfigLite {
  theme_key: string;
  label: string;
  status: string;
  is_recommended: boolean;
  is_favorite: boolean;
  display_order: number;
  category: string;
}

export interface CustomThemeRow {
  theme_key: string;
  label: string;
  status: string;
  category: string;
  display_order: number;
  created_from_theme: string | null;
  theme_tokens: {
    zone_overrides?: Record<string, unknown>;
    zone_css?: Record<string, string | null>;
    text_overrides?: Record<string, string>;
    background_image?: string | null;
    typography_overrides?: Record<string, string | null> | null;
    panel_palette?: { background: string; surface: string; accent: string } | null;
  } | null;
}

export interface CategoryLite {
  slug: string;
  name: string;
  sort_order: number;
}

export const CUSTOM_CATEGORY = 'themes-personnalises';
export const FAV_TAB = 'favoris';
