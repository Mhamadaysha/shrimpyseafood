
-- Create app_role enum and user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Menu items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view menu items"
ON public.menu_items FOR SELECT
USING (true);

-- Admin write
CREATE POLICY "Admins can insert menu items"
ON public.menu_items FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update menu items"
ON public.menu_items FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete menu items"
ON public.menu_items FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for dish photos
INSERT INTO storage.buckets (id, name, public) VALUES ('dish-photos', 'dish-photos', true);

CREATE POLICY "Anyone can view dish photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'dish-photos');

CREATE POLICY "Admins can upload dish photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dish-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete dish photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'dish-photos' AND public.has_role(auth.uid(), 'admin'));

-- RLS for user_roles: admins can read, no self-assignment
CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Seed default menu items
INSERT INTO public.menu_items (name, description, price, category) VALUES
('Grilled Sea Bass', 'Fresh Mediterranean sea bass grilled with herbs, lemon, and olive oil. Served with seasonal vegetables.', 28.99, 'Grilled Fish'),
('Jumbo Shrimp Platter', 'A generous platter of jumbo shrimp, lightly seasoned and grilled to perfection.', 24.99, 'Shrimp'),
('Lobster Thermidor', 'Classic lobster thermidor with creamy mustard sauce, gratinated with cheese.', 42.99, 'Specialties'),
('Seafood Soup', 'Rich and hearty seafood soup with shrimp, mussels, calamari, and fresh herbs.', 14.99, 'Soups & Starters'),
('Calamari Rings', 'Crispy fried calamari rings served with tartar sauce and lemon wedges.', 12.99, 'Soups & Starters'),
('Grilled Salmon Fillet', 'Atlantic salmon fillet grilled with a honey-mustard glaze, served with mashed potatoes.', 26.99, 'Grilled Fish');
