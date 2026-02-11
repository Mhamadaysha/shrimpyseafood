import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/lib/menu-data";

export function useMenuItems() {
  return useQuery({
    queryKey: ["menu-items"],
    queryFn: async (): Promise<MenuItem[]> => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((d) => ({
        ...d,
        price: Number(d.price),
      }));
    },
  });
}

export function getCategories(items: MenuItem[]): string[] {
  return [...new Set(items.map((item) => item.category))];
}
