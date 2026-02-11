import { useState } from "react";
import logo from "@/assets/logo.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import MenuCard from "@/components/MenuCard";
import CategoryFilter from "@/components/CategoryFilter";
import { getMenuItems, getCategories } from "@/lib/menu-data";
import { Link } from "react-router-dom";

const Index = () => {
  const items = getMenuItems();
  const categories = getCategories(items);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative h-[420px] flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="Seafood spread"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 text-center px-4">
          <img src={logo} alt="Shrimpy Seafood" className="w-32 h-32 mx-auto rounded-full object-cover shadow-2xl mb-4 border-4 border-primary-foreground/30" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
            Shrimpy Seafood
          </h1>
          <p className="font-body text-lg text-primary-foreground/80 italic">
            Fresh from the Sea to Your Table
          </p>
        </div>
      </header>

      {/* Admin Link */}
      <div className="container mx-auto px-4 pt-6 flex justify-end">
        <Link
          to="/admin"
          className="text-sm font-body font-semibold text-ocean hover:text-primary transition-colors underline underline-offset-4"
        >
          Admin Panel
        </Link>
      </div>

      {/* Menu */}
      <main className="container mx-auto px-4 py-10">
        <h2 className="font-heading text-3xl font-bold text-center text-foreground mb-2">
          Our Menu
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto rounded-full mb-8" />

        <div className="mb-10">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20 font-body text-lg">
            No items in this category yet.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/70 font-body text-sm">
            © 2026 Shrimpy Seafood Restaurant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
