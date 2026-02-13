ALTER TABLE public.menu_items ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD';
-- currency values: 'USD' or 'LBP'