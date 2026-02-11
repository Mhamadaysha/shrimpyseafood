import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMenuItems } from "@/hooks/useMenuItems";
import { MenuItem } from "@/lib/menu-data";
import { Trash2, Plus, ArrowLeft, Pencil, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const Admin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useMenuItems();
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
      // Check admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
      if (!roles || roles.length === 0) {
        toast.error("You don't have admin access.");
        await supabase.auth.signOut();
        navigate("/admin/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImageFile(null);
    setImagePreview("");
    setEditing(null);
    setShowForm(false);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("dish-photos").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("dish-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) {
      toast.error("Please fill in name, price, and category.");
      return;
    }

    try {
      let image_url = editing?.image_url || "";
      if (imageFile) {
        image_url = await uploadImage(imageFile);
      }

      if (editing) {
        const { error } = await supabase
          .from("menu_items")
          .update({ name, description, price: parseFloat(price), category, image_url })
          .eq("id", editing.id);
        if (error) throw error;
        toast.success("Item updated!");
      } else {
        const { error } = await supabase
          .from("menu_items")
          .insert({ name, description, price: parseFloat(price), category, image_url });
        if (error) throw error;
        toast.success("Item added!");
      }
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditing(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setCategory(item.category);
    setImagePreview(item.image_url);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Item deleted.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-body text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 transition-colors font-body">
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>
          <h1 className="font-heading text-2xl font-bold text-primary-foreground">Admin Panel</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 transition-colors font-body">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 flex items-center gap-2 bg-ocean text-ocean-foreground px-5 py-3 rounded-lg font-body font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-lg p-6 mb-8 border border-border">
            <h2 className="font-heading text-xl font-semibold text-card-foreground mb-6">
              {editing ? "Edit Item" : "Add New Item"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-semibold text-card-foreground mb-1">Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground font-body focus:ring-2 focus:ring-ocean focus:outline-none" />
              </div>
              <div>
                <label className="block font-body text-sm font-semibold text-card-foreground mb-1">Category *</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground font-body focus:ring-2 focus:ring-ocean focus:outline-none" />
              </div>
              <div>
                <label className="block font-body text-sm font-semibold text-card-foreground mb-1">Price *</label>
                <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground font-body focus:ring-2 focus:ring-ocean focus:outline-none" />
              </div>
              <div>
                <label className="block font-body text-sm font-semibold text-card-foreground mb-1">Photo</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground font-body text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ocean/10 file:text-ocean" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-body text-sm font-semibold text-card-foreground mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground font-body focus:ring-2 focus:ring-ocean focus:outline-none resize-none" />
              </div>
            </div>
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-border" />
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button type="submit" className="bg-ocean text-ocean-foreground px-6 py-2.5 rounded-lg font-body font-semibold hover:opacity-90 transition-opacity shadow-md">
                {editing ? "Update Item" : "Add Item"}
              </button>
              <button type="button" onClick={resetForm} className="bg-muted text-muted-foreground px-6 py-2.5 rounded-lg font-body font-semibold hover:bg-muted/80 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-card rounded-lg p-4 shadow-sm border border-border">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-card-foreground truncate">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.category} · ${item.price.toFixed(2)}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-ocean/10 text-ocean hover:bg-ocean/20 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Admin;
