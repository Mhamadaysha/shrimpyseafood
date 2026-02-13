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
          <p className="font-body text-lg text-primary-foreground/80 italic mb-4">Fresh from the Sea to Your Table</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-primary-foreground/80 text-sm font-body">
            <a href="https://maps.google.com/?q=Wadi+Chahrour+oliya+Naddour+Village+Center" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Wadi Chahrour oliya - Naddour Village Center
            </a>
            <span className="hidden sm:inline text-primary-foreground/40">|</span>
            <a href="tel:76777170" className="flex items-center gap-1.5 hover:text-primary-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              76 777170
            </a>
          </div>
        </div>
      </header>

      {/* Menu */}
      <main className="container mx-auto px-4 py-10">
        <h2 className="font-heading text-3xl font-bold text-center text-foreground mb-2">Our Menu</h2>
        <div className="w-16 h-1 bg-coral mx-auto rounded-full mb-8" />

        <div className="mb-10">
          <CategoryFilter categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-20 font-body text-lg">Loading menu...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
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
