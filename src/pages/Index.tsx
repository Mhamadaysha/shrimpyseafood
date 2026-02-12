import { useState } from "react";
import logo from "@/assets/logo.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import MenuCard from "@/components/MenuCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useMenuItems, getCategories } from "@/hooks/useMenuItems";
import { Link } from "react-router-dom";

const Index = () => {
  const { data: items = [], isLoading } = useMenuItems();
  const categories = getCategories(items);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-primary shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Shrimpy Seafood" className="w-10 h-10 rounded-full object-cover border-2 border-gold" />
            <span className="font-heading text-xl font-bold text-primary-foreground">Shrimpy Seafood</span>
          </div>
          <Link to="/admin" className="text-sm font-body font-semibold text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            Admin
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative h-[380px] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Seafood spread" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 text-center px-4">
          
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-2">Shrimpy Seafood</h1>
          <p className="font-body text-lg text-primary-foreground/80 italic">Fresh from the Sea to Your Table</p>
        </div>
      </header>

      {/* Menu */}
      <main className="container mx-auto px-4 py-10">
        <h2 className="font-heading text-3xl font-bold text-center text-foreground mb-2">Our Menu</h2>
        <div className="w-16 h-1 bg-gold mx-auto rounded-full mb-8" />

        <div className="mb-10">
          <CategoryFilter categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-20 font-body text-lg">Loading menu...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20 font-body text-lg">No items in this category yet.</p>
        )}
      </main>

      <footer className="bg-primary py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/70 font-body text-sm">© 2026 Shrimpy Seafood Restaurant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
